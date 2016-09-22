var http = require('http');
var qs = require('querystring');
var request = require('request');
var express = require('express');

var app = express();

const PORT = 8080;  //incoming http PORT

function listener(request, response) {
  console.log("Request recieved...");
  console.log(request.method);
  console.log(request.data);
  if(request.method == "GET") {
    var body = [];
    request.on('data', function(data) {
      body += data;
      //TODO check for data overload
    });
    request.on('end', function() {
      console.log(body);
      var reqJSON = JSON.parse(request.query);
      var resJSON = {pung : true};
      response.end(JSON.stringify(resJSON));
    });
  }
}

app.use("/index.html", express.static(__dirname + "/../client"));
app.post("/rest", listener);

//app.get('/event', listener);

app.listen(PORT, function() {
  console.log("Server listening on " + PORT);
})
