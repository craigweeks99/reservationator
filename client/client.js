/*jslint node: true */
/*jslint browser: true */

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


$("#button").on('click', function() {
    var reqData = {event : "getdays", year : $("#year").attr("value"), days : $("#month").attr("value") + ":" + $("#day").attr("value")};
    console.log(reqData);
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
