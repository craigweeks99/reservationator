/*jslint node: true */
/*jslint browser: true */

var reqData = {event : "ping"};
var daata = JSON.stringify(reqData);
console.log(daata);

$("#button").on('click', function() {
    $.ajax({
        url: "http://localhost:8080/rest",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: daata,
        async: true,
        success: function (data) {
            console.log("ayya");
            $("#response").html(JSON.stringify(data));
            $("#response").addClass("updated");
        },
        failure: function (err) {
            console.log(err);
        }
    })
});
