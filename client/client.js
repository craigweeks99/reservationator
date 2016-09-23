/*jslint node: true */
/*jslint browser: true */

function request(json, successCallback, errorCallback) {
    $.ajax({
        url: "http://localhost:8080/rest",
        type: "POST",
        data: JSON.stringify(reqData),
        async: true,
        success: successCallback,
        error: errorCallback
    })
}

var reqData = {event : "getdays", year : 2016, days : "1:1,1:2,1:3,1:4,1:5"};
var daata = JSON.stringify(reqData);
console.log(daata);

$("#button").on('click', function() {
    request(reqData,
        function (data) {
            $("#response").html(JSON.stringify(data));
            $("#response").addClass("updated");
        },
        function (err) {
            console.log(err);
        }
    );
});
