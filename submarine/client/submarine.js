BlazeLayout.setRoot('body');

Session.set("resize", null);
Meteor.startup(function() {

  // add class to body to turn off the cookies/local storage notification
  $(document.body).addClass('meteor-loaded')

  window.addEventListener('resize', function(){
    Session.set("resize", new Date());
  });

  // on start-up, if no user, set language to chinese
  if (!Meteor.userId()) {
		console.log("New User, Welcome!");
  }

  if (Meteor.isCordova) {

    document.addEventListener("deviceready", function () {
      // override navigation back button
      document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        navigator.app.exitApp();
        console.log("App should be exit");
      });

      // update Geolocation very 10s
      // App.Utils.Geolocation.updateGPSCoordOnChange(10000);

      // update wifi config every 5s
      // App.Utils.WifiWizard.updateWifiConfigOnChange(5000);

      // Return the user's mobile device nearby wifi in a list
      // list is { BSSID: BSSID in string, level: level in string
      App.Utils.WifiWizard.getNearbyWifi();

      // Test pushing notification "World, Hello!"
      // App.Utils.Notification.scheduleSingleNotification("World, Hello!");

      window.FirebasePlugin.getToken(function(token) {
        // save this server-side and use it to push notifications to this device
        console.log("Unique token: " + token);
      }, function(error) {
        console.error(error);
      });

      window.FirebasePlugin.onTokenRefresh(function(token) {
        // save this server-side and use it to push notifications to this device
        console.log(token);
      }, function(error) {
        console.error(error);
      });

      window.FirebasePlugin.onNotificationOpen(function(notification) {
        console.log(notification.body);
      }, function(error) {
        console.error(error);
      });
    }, false);
  }
});
