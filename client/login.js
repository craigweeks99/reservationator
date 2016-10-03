
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

$("#groupinput").on("click", function() {
    $("#confirmbtn").val($(this).val());
    $("#groupselection").find("*").removeClass("selected");
    $(this).addClass("selected");
});

$("#confirmbtn").on("click", function() {
    if($("#groupinput").hasClass("selected"))
    {
        $("#confirmbtn").val($("#groupinput").val());
    }
    var json = {event: "joingroup", token : $.cookie("id_token"), groupID: $("#confirmbtn").val()};
    console.log(json);
    request(json, function(data) {
        var dataJSON = JSON.parse(data);
        if(dataJSON.joined) {
            $.cookie("groupID", dataJSON.groupID);
        }
        $("#message").html("Successfully joined group " + dataJSON.groupID + "!!!");
        window.location.replace("http://localhost:8080/main.html");
    }, function(err) {
        $("#message").html("Problem joining group!");
    })
});

function onSignIn(googleUser) {
    var auth2 = gapi.auth2.getAuthInstance();
    if(auth2.isSignedIn.get()) {
        var id_token = googleUser.getAuthResponse().id_token;
        var tokenJson = {event : "gapiverify", token : id_token};

        $("#message").html("Verifying account with server...");
        request(tokenJson, function(data) {
            var data = JSON.parse(data);
            if(data.verified) {
                $.cookie("id_token", id_token);
                var groupID = $.cookie("groupID");
                if(groupID) {
                    $("#confirmbtn").val(groupID);
                    $("#confirmbtn").trigger("click");
                } else {
                    $("#groupselection").removeClass("hidden");
                    if(data.groups) {
                        var groupHTML = "";
                        for(group in data.groups) {
                            groupHTML += "<li>" + data.groups[group] + "</li>";
                        }
                        $("#groups").html(groupHTML);
                        $("#groups li").on("click", function() {
                            $("#confirmbtn").val($(this).html());
                            $("#groupselection").find("*").removeClass("selected");
                            $(this).addClass("selected");
                        });
                    }
                }
            }
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

$(document).ready(function() {


});
