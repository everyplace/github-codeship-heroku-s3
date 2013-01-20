cheerio = require('cheerio');
async = require('async');

var reader = {
  negative: ['share','head','foot','ad','clearfix','widget','navigat','comment', 'image', 'media', 'meta', 'promo', 'rss', 'shoutbox', 'sponsor', 'side'],
  positive: ['instapaper_body', 'body', 'page', 'content', 'contents,', 'text', 'article', 'blog', 'post', 'main', 'story-body', 'article-body', 'post-body']
};

function clean(item, callback){
    $(item).find('noscript').remove();
    $(item).find('script').remove();
    $(item).find('iframe').remove();
    for (var i in reader.negative){
      $(item).find('[class*=' + reader.negative[i] + ']').remove();
      $(item).find('[id*=' + reader.negative[i] + ']').remove();
    }
    callback(null, item);
}

function fuzzyTestElement(strings){
  var list = [];
  for(var string in strings){
    var tester = new RegExp(strings[string], 'g');
    if(tester.test($(this).attr('class')) || tester.test($(this).attr('id'))){
      list.push(strings[string]);
    }
  }
  return list;
}

function strictTestElement(strings){
  for (var string in strings){
    if($(this).attr('class') === strings[string] || $(this).attr('id') === strings[string]){
      return true;
    }
    else if(string === strings.length)
      return false;
  }
}

/*
  readablity body-text extractor, also we have no idea how big the page you want is, so this is async as hell
*/
module.exports = function(context, finished){
  $ = cheerio.load(context);
  var el_list = [];

  async.forEach($('*'),
    function(item, callback){
      var testEl = fuzzyTestElement.bind(item); //bind the 'this' keyword to the current element
      if (testEl(reader.positive)){
        el_list.push($(item));
      }
      callback(null);
    },
    function(err){
      //removes extraneouos tags and maps all the items to cheerio objects
      async.map(el_list,
        function(item, callback){
          clean(item, callback);
        },
        function(err, results){
          async.sortBy(results, //sorts elements by calculated likelyhood that they are actually the content
            function(item, callback){
              var rank = 0;
              var itemText = item.text();
              //someplace, somewhere these words show up in the id or class of the element, and the more the merrier
              rank += fuzzyTestElement.call(item, reader.positive).length;
              if (strictTestElement.call(item, reader.positive)){
                rank += 10;
              }
              rank += Math.min(Math.floor(itemText.length / 250), 5); //for every 250 characters, add an additional point to the rank, up to 5
              rank += Math.min(Math.floor($(item).find('p').length / 10), 5); //for every <p> element, add an additional point to the rank, up to 5
              rank += Math.min(Math.floor($(item).find('br').length / 10), 5); //for every <br> element, add an additional point to the rank, up to 5
              var punctuation = itemText.match(/[.,!?"]/g); //add points for all punctuation characters
              rank += (punctuation) ? punctuation.length : 0;
              if (itemText.length < 10){
                rank = 0;
              }
              var weight = -(rank);
              callback(null, weight); //negative value because we want the largest weighing item at the top
            },
            function(err, results){
              finished((results[0] || !err) ? undefined : new Error('A result could not be found. Are you sure this is an article?'), (results[0]) ? results[0].text() : undefined);
            });
      });
  });
};
