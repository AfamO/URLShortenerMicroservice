// server.js
// where your node app starts
var url=require('url');
var mongodb = require('mongodb');
var jsonOut={};
function urlInfo(counter,originalUrl,shortUrl){
  this._id=counter;
  this.original_url=originalUrl;
  this.short_url=shortUrl;
  
}
function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
var numbers = [1, 2, 3, 4];
//doc={"original_url":"https://www.google.com","short_url":"https://little-url.herokuapp.com/5414"};
/**
  doc={
  counter:counter,
  original_url:url,
  short_url:"https://rich-alto.glitch.me/"+counter
};
**/
// Connection URL. This is where your mongodb server is running.
//mongodb://<dbuser>:<dbpassword>@ds057934.mlab.com:57934/fccmdb
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
  var originalUrl=request.url.replace("/new/","");
  var MongoClient = mongodb.MongoClient;
  var counter="";


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
      var query={original_url:originalUrl};
      counter=+counter;
      collection.find(query).toArray(function(err,data){
        if (err) throw err;
        console.log(data);
        //Is the original url already existing in db?
        if(data.original_url==originalUrl)
          {
            console.log(originalUrl +" already exists in DB.");
            db.close();
            response.send(jsonOut);
          }
        else
          {
             console.log(originalUrl +" doesn't exists in DB. Thus adding it....");
             counter=shuffle(numbers);//generate unique random number
             console.log("The unique generated random number is::"+counter);
             counter=+counter// converts to numbers
             var doc= new urlInfo(counter,originalUrl,"https://rich-alto.glitch.me/"+counter);
             collection.insert(doc,function(err,data){
             if (err) throw err;
             jsonOut=doc;
             console.log(JSON.stringify(doc))
             db.close()
             response.send(jsonOut);
      });
          }
        
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
