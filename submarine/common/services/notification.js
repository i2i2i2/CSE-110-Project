if (Meteor.isServer) {
  App.Services.Notification = {
    sendGCMNotification: function(msg) {
      msg.time = msg.time.toISOString();
      var gcmNotification = {
        priority: "high",
        notification: {
          body: msg.message
        },
        data: msg
      };

      // add receiver
      if (msg.is_public) {
        gcmNotification.to = msg.receiver;
        var title = App.Collections.Tags.findOne(msg.receiver).name;
      } else {
        var user = Meteor.users.findOne(msg.receiver);
        if (!user.token) return false;

        gcmNotification.to = user.token;
        gcmNotification.notification.title = user.username;
      }

      HTTP.call("POST", "https://fcm.googleapis.com/fcm/send", {
        data: gcmNotification,
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "key=AIzaSyCNk41CknnmKqUrY41CkKz-jH-AQvbVB6E"
        }
      }, function(err, res) {
        if (err)
          console.log("GCM error");
        else
          console.log("GCM success");
      });
    }
  };
}
