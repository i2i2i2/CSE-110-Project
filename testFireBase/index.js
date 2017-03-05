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
    to: "eC5JhLpgvis:APA91bFTPBJWNPQ_4C-m0qtSHvYEDn2Ho5d4gkzeDrTDifxkeK-pld6NbmiyzQtsXBYP0isfDu_3nDTuKQyqj4qQPYMcw4xPiyWUjusMZaYBJnJK5SaoOLWbL4pinQD66iNOUBE8HHI9",
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
