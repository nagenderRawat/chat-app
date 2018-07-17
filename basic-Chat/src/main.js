// Import promise and fetch polyfills for IE11
import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
const OT = require('@opentok/client');

import Vue from 'vue';
import Session from './Session.vue';

// const createSession = (apiKey, sessionId, token)=> {
//   new Vue({
//     el: '#app',
//     render: h => h(Session, {
//       props: {
//         sessionId,
//         apiKey,
//         token
//       }
//     })
//   });
// };

// if (config.API_KEY && config.TOKEN && config.SESSION_ID) {
//   initializeSession();
  // createSession(config.API_KEY, config.SESSION_ID, config.TOKEN);
// } else {
  fetch(config.SAMPLE_SERVER_BASE_URL + '/session')
    .then((data) => data.json())
    .then((json) => {
      initializeSession(json.apiKey, json.sessionId, json.token);
    }).catch((err) => {
      alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    });
// }


// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

var session, publisher
function initializeSession(apiKey, sessionId, token) {
  session = OT.initSession(apiKey, sessionId, token);
  console.log("session???????", session);

  // Create a publisher
  publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      console.log("connected successfully");
    }
  });
  session.on('signal:msg', function(event) {
    if(event.from.connectionId !== session.connection.id) {
      var para = document.createElement("p");
      var node = document.createTextNode('Friend: ' + event.data);
      para.appendChild(node);

      var element = document.getElementById("chatContainer");
      element.appendChild(para);
    }
  });

  publisher.on({
    streamCreated: function (event) {
      console.log("Publisher started streaming.", event);
    },
    streamDestroyed: function (event) {
      console.log("Publisher stopped streaming. Reason: "
        + event.reason);
    }
  });
}


document.getElementById('button123').addEventListener("keypress",function(e) {
  var key = e.keyCode;

  // If the user has pressed enter
  if (key == 13) {
    session.signal({
      type: 'msg',
      data: e.target.value
    }, function(error) {
      if (error) {
        console.log('Error sending signal:', error.name, error.message);
      } else {
        var para = document.createElement("p");
        var node = document.createTextNode('Me: ' + e.target.value);
        para.appendChild(node);

        var element = document.getElementById("chatContainer");
        element.appendChild(para);
        e.target.value = "";
      }
    });
    // document.getElementById("txtArea").value =document.getElementById("txtArea").value + "\n";
    return false;
  }
  else {
    return true;
  }
});



