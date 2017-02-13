var request = require("request");

var options = {

  //Unchanged
  method: "POST",
  uri: "https://fcm.googleapis.com/fcm/send",
  headers: {
    'Content-Type': 'application/json',
    "Authorization": "key=AIzaSyCNk41CknnmKqUrY41CkKz-jH-AQvbVB6E"
  },
  body: JSON.stringify({
    to: "d1zHubOBS2g:APA91bFOY2uNDzJTzHqGzCtqCM7xocofIC5amURrwCO4E7r1_Wy4NEdZFkR2BOEN5EiTf8QaVKBl5YQWcve8pUst3EZrkqVCDCPLSDqvz8VIxi3XAJqVBuM5c4z5P9Hq4EzU7RTpWpfP",
    priority: "high",
    notification: {
      title: "test",
      body: "Hello sent from firebase"
    }

  })

};

request(options, function(err, res, body) {
  console.log(JSON.stringify(err, undefined, 2));
  console.log(JSON.stringify(res, undefined, 2));
})
