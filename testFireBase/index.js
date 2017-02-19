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
    to: "f_CqsgA5_1c:APA91bFSER0jkTff_aCRDXZ4b1QV7R2GgXfL3o86dL8IVBxq0F_G710JvY6-3VDPZ_hpXqNJ_LeXeAEkKaWDwUcLmApIwNPwPG0M7K0H1cWgsksKpsSUdVXKqIfx4KaGc8evZLnJgXIs",
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
