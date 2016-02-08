'use strict';

var express=require("express");
var mongo=require("mongodb").MongoClient;
var request = require('request');
//var url = 'mongodb://localhost:27017/images';

require('dotenv').config({silent: true});

console.log(process.env.MONGOLAB_URI)
var url=process.env.MONGOLAB_URI;

var app=express();
app.use(express.static(__dirname+ '/public'));



app.get('/', function(req, res){
    res.sendFile(process.cwd() + '/index.html');
});

app.get('/search/:searchstring/:page?', function(req, res){

    var searchstring=req.params.searchstring;
    var page=(req.params.page!=undefined) ? parseInt(req.params.page) : 1;

    var searchUrl="https://www.googleapis.com/customsearch/v1?googlehost=google.com&safe=medium&searchType=image&key="+process.env.API_KEY+"&cx="+process.env.CSEID+"&q="+searchstring+"&start="+page+"&num=10";


    mongo.connect(url, function(err,db){
      if(err){throw err}
      var coll=db.collection('history');
      coll.find({query: searchstring, page: page}).toArray(function(err,result){
        if(err){throw err}
        if(result.length>0){
          res.send(JSON.stringify(result[0]["result"]));
        }
        else{
          request(searchUrl,{json: true},function(error, response, data) {
          if(!error && response.statusCode == 200) {
            var newData = data.items.map(function (item) {
              return {
                url: item.link,
                snippet: item.snippet,
                thumbnail: item.image.thumbnailLink,
                context: item.image.contextLink
                };
              });
              coll.insert({
                    date: Date.now(),
                    query: searchstring,
                    page: page,
                    result: newData
              });

            res.json(newData);
          }});
          }
      });
    });
  });


  app.get('/recent', function(req,res){
    mongo.connect(url, function(err,db){
      var coll=db.collection('history');
      coll.find().sort({date: -1}).toArray(function(err, result){
        if(err){throw err}
        var out=result.slice(0,10);

        res.send(JSON.stringify(out, ["date", "query", "page"]));

      });
    });
  });



var port=process.env.PORT || 3000;
app.listen(port, function(){
    console.log('Node.js listening on port ...' + port + '...');
});
