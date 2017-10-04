// server.js
// where your node app starts
var url=require('url');
var mongodb = require('mongodb');
function urlInfo(counter,originalUrl,shortUrl){
  this._id=counter;
  this.original_url=originalUrl;
  this.short_url=shortUrl;
  
}
function connectToAndInsertIntoMongoDB(url){
    //We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
var counter="00001";
var doc= urlInfo(counter,"http://www.afamo/","http://www.afamo/"+counter);
// Connection URL. This is where your mongodb server is running.
//mongodb://<dbuser>:<dbpassword>@ds057934.mlab.com:57934/fccmdb
//(Focus on This Variable)
var dbUrl = 'mongodb://AfamO:me17!mlab@ds057934.mlab.com:57934/fccmdb';     
//(Focus on This Variable)
// Use connect method to connect to the Server 
  MongoClient.connect(dbUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to my', dbUrl);
    var collection=db.collection('url-shortener');
    if(collection!=null){
      
      counter=+counter;
      
      collection.insert(doc,function(err,data){
        if (err) throw err;
        console.log(JSON.stringify(doc))
        db.close()
      });
    }
    else{
        console.log('Could not find collection url-shortener');
    }

    // do some work here with the database.

    //Close connection
    db.close();
  }
});  
}


// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
//https://little-url.herokuapp.com/new/https://www.google.com
//{ "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
// http://expressjs.com/en/starter/basic-routing.html

app.get("/[0-9]", function (request, response) {
  response.send("Thank you!");
  //response.sendFile(__dirname + '/views/index.html');
});
app.get("/new/*", function (request, response) {
  var parsedUrl=url.parse(request.url, true);
  //response.send(JSON.stringify(parsedUrl));
  var originUrl=request.url.replace("/new/","");
  connectToAndInsertIntoMongoDB(originUrl);
  response.send(originUrl);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
