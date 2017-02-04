Template.Profile.onRendered(function() {
  Session.set("currentTemplate", "profile");
});

Template.Profile.events({
  "click .button[data-action=logout]": function(e, t) {
    Meteor.logout();
  },

  "click .button[data-action=random]": function(e, t) {
    console.log("randomed");
    Meteor.call('user/rollProfilePicture', (err, res) => {
      $('.button[data-action=random]').removeClass('active');
    });

    $('.button[data-action=random]').addClass('active');
  },

  "click .button[data-action=changeEmail]": function(e, t) {
    console.log("changeEmail");
    var newEmail = $('.email').val();
    var regexpEmail = /.+@(.+){2,}\.(.+){2,}/;
    if (regexpEmail.test(newEmail)){
      $('.checkEmail').text("Changed Successfully");
      Meteor.call('user/changeEmail', newEmail, (err, res) => {
              $('.button[data-action=changeEmail]').removeClass('active');
      });

      $('.button[data-action=changeEmail]').addClass('active');
      }
      else{
        console.log("Invalid");
        $('.checkEmail').text("Invalid Email");
      }
    },

    "click .button[data-action=changeUserName]": function(e, t) {
      console.log("changeUsername");
      var newUsername = $('.userName').val();
      Meteor.call('user/changeUserName', newUsername, (error, res) => {
      if(error){
        console.log("Invalid");
        $('.Invalid').text("Invalid username");
      }
      else{
        $('.button[data-action=changeUserName]').addClass('active');
        $('.Invalid').text("Username Changed Successfully");
        $('.button[data-action=changeUserName]').removeClass('active');
      }
      });

      }
});

Template.Profile.helpers({
  randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null,
  profilePic: () => Meteor.userId()? Spacebars.SafeString(GeoPattern.generate(Meteor.user().profile.profileSeed).toSvg()) : null
});
