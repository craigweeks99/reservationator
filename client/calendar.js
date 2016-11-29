function request(json, successCallback, errorCallback) {
    $.ajax({
        url: "http://localhost:8080/rest",
        type: "POST",
        data: JSON.stringify(json),
        async: true,
        success: successCallback,
        error: errorCallback
    })
}

function getFirstDate(){
    var date = today;
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
}

function getLastDate(){
    var date = today;
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
}

var calDates = [];
var y = 0;
var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
var today = new Date(); //<---------------------------------------------------------------------------------------------------------------------------Insert Date Here <--Leave blank for today
document.getElementById("calander").rows[0].cells[0].innerHTML = monthNames[today.getMonth()] + " " + today.getFullYear();

for(i = 0; i<7; i++){
    calDates[i] = [];
    for(j = 0; j<6; j++){
        calDates[i][j] = 0;
    }
}


for(i = 0; i<Number(getLastDate().getDate()); i++){
    x = Number(new Date(today.getFullYear(),today.getMonth(),i+1).getDay());
    calDates[x][y] = i+1;
    document.getElementById("calander").rows[y+2].cells[x].innerHTML = calDates[x][y];
    document.getElementById("calander").rows[y+2].cells[x].setAttribute("class", "daybutton");

    document.getElementById("calander").rows[y+2].cells[x].setAttribute("date", today.getFullYear() + " " +  today.getMonth() + " " + calDates[x][y]);
    if(x==6){y++;}
    if(i+1 == Number(today.getDate())){
        document.getElementById("calander").rows[y+2].cells[x].style.backgroundColor='#008CBA';
    }
}

var modal = document.getElementById("schedule");
var table = document.getElementById("calander");
var closeBtn = document.getElementById("close");


$("#calander .daybutton").on("click", (event)=>{

    var selectedday = event.target.getAttribute("date").split(" ");
    $("#schedule #date").html(selectedday[0] + "/" + selectedday[1] + "/" + selectedday[2]);
    var requestJSON = {
        event : "getdayinfo",
        ymd : selectedday[0] + selectedday[1] + selectedday[2],
        year : selectedday[0],
        month : selectedday[1],
        day : selectedday[2],
	groupID : $.cookie("group_id"),
        token : $.cookie("id_token")
    }
    request(requestJSON, function(data) {          //make request to server and recieve data
        var dataJSON = JSON.parse(data);    //parse data string to jso
        //for period in schedule show expandable box
        console.log(data);
        var scheduleHTML = "";
        var day = JSON.parse(dataJSON.day);
        schedule.html
        for(var p in day.schedules[0].periods) {
            var period = day.schedules[0].periods[p];
            scheduleHTML += "<div class=.period>" + period.name + ": " + period.start + " to " + period.end + "</div>";
        }
        $("#schedule .modal-content").append(scheduleHTML);
    }, function(err) {
        console.log("error retrieving day");
    })
    var contentJSON = 0;
        $("#schedule").addClass("show");
    //$("#schedule")
})


$("#close").on("click", ()=>{
    $("#schedule").removeClass("show");
})

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function dropBtn1(){
    document.getElementById("dropdown1").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.addResource')) {
        var dropdowns = document.getElementsByClassName("dropdown1-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
