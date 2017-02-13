/**
 * Meteor Accounts Settings,
 * define what to do when new user created, How to send reset password email
 */

Accounts.config({
  sendVerificationEmail: false,
  forbidClientAccountCreation: false
})

/**
 * Initialize student User account with basic data on first login
 */
Accounts.onCreateUser((options, user) => {
  // make friends
  if (["Ensign", "Lieutenant", "Commander", "Captain", "Admiral", "JohnD", "JaneD"].indexOf(user.username) == -1) {
    var ensign = Accounts.findUserByUsername("Ensign")._id;
    var lieutenant = Accounts.findUserByUsername("Lieutenant")._id;
    var commander = Accounts.findUserByUsername("Commander")._id;
    var captain = Accounts.findUserByUsername("Captain")._id;
    var admiral = Accounts.findUserByUsername("Admiral")._id;
    var john = Accounts.findUserByUsername("JohnD")._id;
    var jane = Accounts.findUserByUsername("JaneD")._id;

    Meteor.users.update({name: {$in: ["Ensign", "Lieutenant", "Commander", "Captain", "Admiral"]}}, {$push: {"profile.friends": {userId: user._id}}});

    user.profile = {
      profileSeed: Random.id(8),
      friendRequest: [john],
      recommendedFriends: [{userId: jane, recommendReason: "You have this recommendation by default"}],
      turndownFriends: [],
      friends: [{userId: ensign}, {userId: lieutenant}, {userId: commander}, {userId: captain}, {userId: admiral}],
      Strangers: []
    };
  } else {
    user.profile = {
      profileSeed: Random.id(8),
      friendRequest: [],
      recommendedFriends: [],
      turndownFriends: [],
      friends: [],
      Strangers: []
    };
  }

  var earth = App.Collections.Tags.findOne({name: "Earth"})._id;
  var mars = App.Collections.Tags.findOne({name: "Mars"})._id;
  var moon = App.Collections.Tags.findOne({name: "Moon"})._id;
  user.profile.savedTags = [{tagId: earth, validThru: new Date(2018, 1, 1)}, {tagId: mars, validThru: new Date(2018, 1, 1)}, {tagId: moon, validThru: new Date(2018, 1, 1)}];
  user.allowBeRecommended = true;

  // subscribe tags
  App.Collections.Tags.update({name: {$in: ["Earth", "Mars", "Moon"]}}, {$push: {"users": user._id}});

  return user;
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
    "Copy the token to specified field to reset your password: \r\n\n\n" +  url;

  Accounts.emailTemplates.resetPassword.html = (user, url) =>
    "<p>Copy the token to specified field to reset your password:</p><p>" + url + "</p>";

  Accounts.urls.resetPassword = (token) => token
};
