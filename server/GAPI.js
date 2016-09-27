var verifier = require('google-id-token-verifier');

// ID token from client

// app's client IDs to check with audience in ID Token.
var clientId = '795485120668-g9bvskc0h1fgp6v1u2n1ll06otvg6f9g.apps.googleusercontent.com';
function verifyUserToken(tokenJSON) {
  var verification = verifier.verify(tokenJSON.token, clientId, function(err, info) {
    console.log(err);
    console.log(info);
  });
  if(verification) {return true;} else {return false;}
}
