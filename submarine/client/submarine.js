BlazeLayout.setRoot('body');

Session.set("resize", null);
Meteor.startup(function() {

  if (Meteor.isCordova) {

    document.addEventListener("deviceready", function () {

      // override navigation back button
      document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        if (/^\/user/.test(FlowRouter.current().path)) {
          navigator.app.exitApp();
        } else {
          window.history.back();
        }
      });

      // gcm init
      window.FirebasePlugin.getToken(function(token) {
        // save this server-side and use it to push notifications to this device
        if (Meteor.userId())
            console.log(JSON.stringify(token));
          Meteor.call("user/updateToken", token);

      }, function(error) {
        console.error(error);
      });

      window.FirebasePlugin.onNotificationOpen(function(notification) {
        // update new msg
        var latestMsg = Session.get("latestMsg");
        notification.time = new Date(notification.time);
        if (!latestMsg) latestMsg={};

        latestMsg[notification.sender] = notification;
        Session.set("latestMsg", latestMsg);
        //
      }, function(error) {
        console.error(error);
      });
    }, false);
  }
});
