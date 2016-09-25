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
    this.addSchedule = function(schedule) {
      this.schedules.push(schedule);
    }
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




var dayarray = {};

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
            var days = json.days.split(",");        //split dates
            var resJson = {};
            for(var ii = 0; ii < days.length; ii++) {
                console.log("Day:" + days[ii]);
                resJson[days[ii]] = dayarray[days[ii]];
            }
            console.log(dayarray["201611"]);
            response.end(JSON.stringify(resJson));
        } else if (json.event == "resourcetypestatus") {
            var result = checkResourceTypeStatus(json.year, json.month, json.day)
        }else {
            var resJSON = {"pung" : "true"};
            response.end(JSON.stringify(resJSON));
        }

      var reqJSON = JSON.parse(body);

  });

}

app.use("/", express.static(__dirname + "/../client"));
app.post("/rest", listener);

var aday = new schedule("a-day");
aday.addPeriod("Period 1", "8:15am", "9:47am");
aday.addPeriod("Period 2", "9:52am", "11:25");
aday.addReservable("chromecart");

var bday = new schedule("b-day");
bday.addPeriod("Period 5", "8:15am", "9:47am");
bday.addPeriod("Period 6", "9:52am", "11:25");
bday.addReservable("chromecart");


var chromecart = new resourceType("chromecart");

//app.get('/event', listener);
for(mm = 0; mm < 12; mm++) {
    for(dd = 0; dd < 30; dd++) {
        var d = new day(2016, mm, dd);
        if(dd%2 == 0) {d.addSchedule(bday);} else {d.addSchedule(aday);}

        dayarray["2016" + String(mm+1) + String(dd+1)] = d;
    }
}
console.log(dayarray["201611"]);

app.listen(PORT, function() {
  console.log("Server listening on " + PORT);
})
