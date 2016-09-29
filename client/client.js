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
    var reqData = {event : "getdays", start : $("#year").val() + $("#month").val() + $("#day").val(), end : $("#year").val() + $("#month").val() + "20"};
    console.log(JSON.stringify(reqData));
    request(reqData,
        function (data) {
            var json = JSON.parse(data);
            var dayhtml = "";
            console.log(json);

            var periods = "";
            $.each(json, function(key, value) {
                $.each(value, function(key2, value2) {
                    dayhtml += ("<li>" + key2 + " : " + value2 + "</li>");
                });
                for (var ss = 0; ss < value.schedules.length; ss++) {
                    var pps = value.schedules[ss].periods;
                    for (var pp = 0; pp < pps.length; pp++) {
                        periods += "<li>" + pps[pp].name + "</li>";
                    }
                }
            });

            $("#periods").html(periods);
            $("#response").html(dayhtml);
            $("#response").addClass("updated");
        },
        function (err) {
            console.log(err);
        }
    );
});

function onSignIn(googleUser) {
    var auth2 = gapi.auth2.getAuthInstance();
    if(auth2.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        var id_token = googleUser.getAuthResponse().id_token;
        var tokenJson = {event : "gapiverify", token : id_token};
        console.log(id_token);
        request(tokenJson, function(data) {
            console.log("Token Status: " + data);
        }, function(err) {
            console.log(err);
        })
    }
    auth2.isSignedIn.listen(signinChanged);
    auth2.currentUser.listen(userChange);
}

function userChange() {

}

function signinChanged() {

}
