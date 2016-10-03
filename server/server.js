var http = require('http');
var qs = require('querystring');
var request = require('request');
var express = require('express');


users = {};
var groups =
{
    defaultone : {
        restrictive : false,    //anyone can join
        users : {
            authlevel : [],
            ids : []
        }
    }
}

var app = express();

const PORT = 8080;  //incoming http PORT

function listener(request, response) {
  console.log("Request recieved...");

  var body = [];
  request.on('data', function(data) {
      body += data;
        //TODO check for data overload
    });
    request.on('end', function() {
        console.log("DATA RECIEVED: " + body);
        var json = JSON.parse(body);
        if(json.event == "getdays") {
            console.log("Returning dates from " + json.start + " to " + json.end);
            var start = days.indexOf(json.start);
            var end = days.indexOf(json.end);
            var resarr = dayarray.slice(start, end);
            var resJson = {};
            for(var i = 0; i < resarr.length; i++) {
              resJson[resarr[i].day] = resarr[i].info;
            }

            var res = JSON.stringify(resJson);
            console.log("returning days: " + res);
            console.log("dayrange: " + start + " " + end);
            response.end(res);
        } else if (json.event == "addSchedule") {

        } else if (json.event == "resourcetypestatus") {
            var result = checkResourceTypeStatus(json.year, json.month, json.day)
        } else if (json.event == "gapiverify") {
            var resJson = {verified : false}
            verifyUserToken(json.token).then(function(user) {
                if(user.verified){
                    resJson.verified = true;
                    if(users[user.sub]) {
                        resJson.groups = users[user.sub].groups;
                    } else {
                        users[user.sub] = user;
                        users[user.sub].groups = [];
                    }
                }
                response.end(JSON.stringify(resJson));
            }, function (err) {
                console.log("User token verification failed!!");
                response.end(JSON.stringify(resJson));
            });
        } else if (json.event == "joingroup") {
            var resJSON = {groupID : json.groupID};
            verifyUserToken(json.token).then(function(user) {
                if(user.verified) {
                    resJSON.verified=true;
                    if(groups[json.groupID])
                    {
                        if(groups[json.groupID].users.ids.indexOf(user.sub) > -1) {
                            resJSON.joined = true;
                        } else if(!groups[json.groupID].restrictive) {
                            groups[json.groupID].users.ids.push(user.sub);  //add user to that group
                            resJSON.joined = true;
                            users[user.sub].groups.push(json.groupID);
                        } else {
                            resJSON.joined = false;
                        }
                    } else {
                        resJSON.joined = false;
                    }
                } else {
                    resJSON.verified = false;
                }
                response.end(JSON.stringify(resJSON));
            });
        } else {
            var resJSON = {"pung" : "true"};
            response.end(JSON.stringify(resJSON));
        }

  });

}

app.use("/", express.static(__dirname + "/../client"));
app.post("/rest", listener);




app.listen(PORT, function() {
  console.log("Server listening on " + PORT);
})
