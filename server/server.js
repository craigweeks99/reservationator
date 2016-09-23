var http = require('http');
var qs = require('querystring');
var request = require('request');
var express = require('express');
var clndr = require('node-calendar');

var app = express();

const PORT = 8080;  //incoming http PORT

var epoch = new Date().getTime();
var datetime = Date(epoch).split(" ");
var date = {
    dayname : datetime[0],
    month : datetime[1],
    daynumber : datetime[2],
    year : datetime[3],
    time : datetime[4],
    zonecode : datetime[5],
    zonename : datetime[6]
}



function resourceType(name, properties) {
    this.name = "";
    this.properties = properties || {};
}

function resourceInstance(type, properties) {
    this.id = "1099185";    //TODO ID GENERATION
    this.type = type;
    this.properties = properties || typelist[type].properties;
}

function day(year, month, day, schedules) {
    this.year = year || 2016;
    this.month = month || 1;
    this.day = day || 1;
    this.schedules = schedules || [];
}

function schedule(name) {
    this.name = name || "sch"   //name for schedule (can be added to multiple days)
    this.reservables = [];      //list of resources that can be reserved during periods in this schedule
    this.periods = [];          //portions of time during which reservables can be schedules
    this.addPeriod = function(name, start, end) {
        var p = {
            "name" : name,
            "start" : start,
            "end" : end
        }
        this.periods.push(p);
    }
    this.addReservable = function(name) {
        this.reservables.push(name);
    }
}

//var cal = new clndr.Calendar(clndr.MONDAY);
//var yearCalendar = cal.yeardayscalendar(epoch);
//console.log(date);
//console.log(cal.itermonthdates(2016, 2));

var aday = new schedule("a-day");
aday.addPeriod("Period 1", "8:15am", "9:45am");
aday.addReservable("chromecart");

console.log(aday);

var chromecart = new resourceType("chromecart");

var dayarray = [];

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
            var days = json.days.split(",");
            for(dd = 0; dd < days.length; dd++){
                days[dd] = days[dd].split(":");
            }
            response.end(JSON.stringify(dayarray[0]));
        } else {
            var resJSON = {"pung" : "true"};
            response.end(JSON.stringify(resJSON));
        }

      var reqJSON = JSON.parse(body);

  });

}

app.use("/index.html", express.static(__dirname + "/../client"));
app.post("/rest", listener);

//app.get('/event', listener);
for(mm = 0; mm < 12; mm++) {
    for(dd = 0; dd < 30; dd++) {
        dayarray.push(new day(2016, mm, dd));
    }
}

app.listen(PORT, function() {
  console.log("Server listening on " + PORT);
})
