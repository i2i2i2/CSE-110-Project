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

    Meteor.call('user/changeEmail', newEmail, (err, res) => {
            $('.button[data-action=changeEmail]').removeClass('active');
    });

    $('.button[data-action=changeEmail]').addClass('active');
    }
});

Template.Profile.helpers({
  randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null,
  profilePic: () => Meteor.userId()? Spacebars.SafeString(GeoPattern.generate(Meteor.user().profile.profileSeed).toSvg()) : null
});
