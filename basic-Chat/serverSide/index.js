var express = require('express');
var app = express();

// Set the following constants with the API key and API secret
// that you receive when you sign up to use the OpenTok API:
var OpenTok = require('opentok');
var APT_KEY = "46153972";
var sessionId;
var token;
var opentok = new OpenTok(APT_KEY, "95fda6c02ea46d0960c9201520f1af4c5afc81e6");

console.log("opentok >>>>>>>>", opentok);

//Generate a basic session. Or you could use an existing session ID.

opentok.createSession({}, function(error, session) {
  if (error) {
    console.log("Error creating session:", error)
  } else {
    sessionId = session.sessionId;
    console.log("Session ID: " + sessionId);
    //  Use the role value appropriate for the user:
    var tokenOptions = {};
    tokenOptions.role = "publisher";
    tokenOptions.data = "username=bob";

    // Generate a token.
    token = opentok.generateToken(sessionId, tokenOptions);
    console.log(token);
  }
});

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/session', function (req, res) {
  res.json({apiKey: APT_KEY, sessionId: sessionId, token: token});
});


// var SERVER_BASE_URL = 'https://YOURAPPNAME.herokuapp.com';
// fetch(SERVER_BASE_URL + '/session').then(function(res) {
//   return res.json()
// }).then(function(res) {
//   apiKey = res.apiKey;
//   sessionId = res.sessionId;
//   token = res.token;
//   initializeSession();
// }).catch(handleError);



app.listen(3000);
