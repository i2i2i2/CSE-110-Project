BlazeLayout.setRoot('body');

Session.set("resize", null);
Meteor.startup(function() {

  if (Meteor.isCordova) {

    document.addEventListener("deviceready", function () {

      // override navigation back button
      document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        navigator.app.exitApp();
        console.log("App should be exit");
      });

      // gcm init
      window.FirebasePlugin.getToken(function(token) {
        // save this server-side and use it to push notifications to this device
        if (Meteor.userId())
          Meteor.call("user/updateToken", token);

      }, function(error) {
        console.error(error);
      });

      window.FirebasePlugin.onNotificationOpen(function(notification) {
        // update new msg
        var lastRead = Session.get("lastRead");
        lastRead[notification.data.receiver] = notification.data;
        Session.set(lastRead);
        
      }, function(error) {
        console.error(error);
      });
    }, false);
  }
});
