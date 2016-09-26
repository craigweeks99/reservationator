var ga = require("googleapis");

function recieveUserToken() {

}

var googleIDToken = null;
function verifyUserToken(tokenJSON) {
    var verifier = new ga.GoogleIdTokenVerifier.Builder(transport, jsonFactory)
        .setAudience(Arrays.asList("795485120668-g9bvskc0h1fgp6v1u2n1ll06otvg6f9g.apps.googleusercontent.com"))
        .setIssuer("acounts.google.com")
        .build();

    googleIDToken = verifier.verify(tokenJSON.token);

    if(googleIDToken) {return true;} else {return false;}
}
