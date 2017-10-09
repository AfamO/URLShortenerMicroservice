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
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
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
var dbUrl = 'mongodb://AfamO:me17!mlab@ds057934.mlab.com:57934/fccmdb'; 
var MongoClient = mongodb.MongoClient;
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
//https://little-url.herokuapp.com/new/https://www.google.com
//{ "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
// http://expressjs.com/en/starter/basic-routing.html

app.get("/[0-9]*", function (request, response) {
var counter=request.url.replace("/","");
//counter=counter.replace("/","")
 console.log(counter +" was sent as a requested port");
  // Use connect method to connect to the Server 
  MongoClient.connect(dbUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to my', dbUrl);
    var collection=db.collection('url-shortener');
    if(collection!=null){
      counter=+counter;
      var query={_id:counter};
      collection.findOne(query,function(err,data){
      if (err) throw err;
        console.log(data);
        //Is the original url already existing in DB?
        if(data!=null)
          {
             if(data._id==counter)
            {
                console.log(counter +" port was found in DB.");
                db.close();
                var location="https://ide.c9.io/afamo/afamwspace";
                return response.redirect(data.original_url);
            }
          }
        else
          {
           console.log(counter +" port was not found in DB.");
           response.send("Sorry!, but we can't find the corresponding original url of the short url https://rich-alto.glitch.me"+request.url+" you requested for");
          }
      });//End findOne callback
    }
      else{
        console.log('Could not find collection url-shortener');
    }

    // do some work here with the database.

    //Close connection
    db.close();
  }
});//Close outer DB connection

  
});
app.get("/new/*", function (request, response) {
  var parsedUrl=url.parse(request.url, true);
  response.send(JSON.stringify(parsedUrl));
  var originalUrl=request.url.replace("/new/","");
  if(!ValidURL(originalUrl)){
    response.send("Invalid http address/Url, Please enter valid one");
  }

  var counter="";


//(Focus on This Variable)
    
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
      collection.findOne(query,function(err,data){
        if (err) throw err;
        console.log(data);
        //Is the original url already existing in DB?
        if(data!=null)
          {
             if(data.original_url==originalUrl)
            {
                console.log(originalUrl +" already exists in DB.");
                db.close();
                response.send(data);
            }
          }
        else
          {  
             db.close();
             console.log(originalUrl +" doesn't exists in DB. Thus adding it....");
             counter=String(shuffle(numbers));//generate unique random number
             counter=counter.replace(/,/gi,"");
             console.log("The unique generated random number is::"+counter);
             counter=+counter// converts to numbers
             var doc= new urlInfo(counter,originalUrl,"https://rich-alto.glitch.me/"+counter);
             MongoClient.connect(dbUrl, function (err, db) {
             collection=db.collection('url-shortener');
             collection.insert(doc,function(err,data){
             if (err) throw err;
             jsonOut=doc;
             console.log(JSON.stringify(doc))
             db.close()
             response.send(jsonOut);
          });//Close Inner Db conection
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
});//Close outer DB connection

});//Close http get method

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
