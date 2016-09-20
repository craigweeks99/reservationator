var http = require('http');
var qs = require('querystring');
var request = require('request');

const PORT = 8080;  //incoming http PORT

function listener(request, response) {
  console.log("Request recieved...");
  if(request.method == "GET") {
    var reqBody = [];
    request.on('data', function(data) {
      body += data;
      //TODO check for data overload
    });
    request.on('end', function() {
      var reqJSON = JSON.parse(body);
      response.end("Hello World");
    });
  }
}

var server = http.createServer(listener);

server.listen(PORT, function() {
  console.log("Server listening on %i" + PORT);
})
