/**
 * Meteor Accounts Settings,
 * define what to do when new user created, How to send reset password email 
 */

/**
 * Initialize student User account with basic data on first login
 */
Accounts.onCreateUser((options, user) => {
  
  // prevent useraccount package override username
  if (options.profile) {
    var profile = {
      name: options.profile.fullname || options.profile.name
    };
    user.profile = profile;
  }

  return user;
});

/**
 * Set what to do when user login
 */
Accounts.onLogin(function () {
  var user = Meteor.user();

  Meteor.users.update(user._id, {
    $set: {
      latestLogin: new Date()
    }
  });
});

/**
 * Set reset password email template, initialized when server startup
 */
App.Initializer.configureResetEmail = function() {
  Accounts.emailTemplates.siteName = "Submarine";
  Accounts.emailTemplates.from = "noreply.submarine.cse110@gmail.com";
  Accounts.emailTemplates.resetPassword.subject = (user) =>
    "Reset your password on Submarine";

  Accounts.emailTemplates.resetPassword.text = (user, url) =>
    "Click on the link to reset your password: \r\n\n\n" +  url;

  Accounts.emailTemplates.resetPassword.html = (user, url) =>
    "<p>Click on the link to reset your password:</p><p>" + url + "</p>";

  Accounts.urls.resetPassword = (token) =>
    Meteor.absoluteUrl('reset-password/' + token);
};

