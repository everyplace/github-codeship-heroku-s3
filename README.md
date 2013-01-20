Github/Codeship/Heroku/S3 Workflow Automation
=============================================

Want to simulate a contiuous integration setup for github-hosted projects? Want to automatically cache a subset of those files to an S3 instance? You're in the right place then. If you have a github account, linked to codeship, with a valid heroku instance, and an s3 api key/secret set w/ appropriate bucket, then this project may help you.

Usage
-----

* Fork repo
* Either populate the props object at the beginning of app.js manually, or set environmental variables
	* With heroku, use heroku config:add to add key/value server environment pairs (see Note below)
	* For local testing (e.g. with Foreman), populate the .env file
* Create a heroku app (using heroku create, or manually)
* Create a new codeship.io project, linking your github repo and heroku instance
* Commit changes to github, watch as your codeship project picks up the changes, deploys them to heroku, and then deploys assets from heroku to s3



Note: Command-line Heroku Key Setup Example
-------------------------------------------

```
git clone http://github.com/everyplace/github-codeship-heroku-s3.git
heroku create
heroku config:add KEY=<amazon s3 api key>
heroku config:add SECRET=<amazon s3 api secret>
heroku config:add BUCKET=<amazon s3 bucket>
```

Normally, the next step would be to deploy to Heroku, but the purpose of this setup is to use the continuous integration of CodeShip to do deployment, hence the setup between the three services