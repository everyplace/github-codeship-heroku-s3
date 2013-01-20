## reader is a content extractor for node
### Installation:
`npm install reader`

### Usage:
```javascript
var reader = require('reader');
reader(html, function(err, text){
    if (!err) console.log('check out this sweet article bro: ', text);
});
```