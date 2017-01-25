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

  // these might be implemented in later versions of meteor...
  if (!Meteor.isProduction) {
    Meteor.isProduction = Meteor.settings.public.ENVIRONMENT === 'prod'
  }
  if (!Meteor.isDevelopment) {
    Meteor.isDevelopment = Meteor.settings.public.ENVIRONMENT !== 'prod'
  }

  if (Meteor.isCordova) {

    // override navigation back button
    document.addEventListener("deviceready", deviceReady, false);
    function deviceReady (){
      document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        navigator.app.exitApp();
        console.log("App should be exit");
      });
    }

    // update GPS coord every 5s
    
    // update wifi config every 5s
  }
});
