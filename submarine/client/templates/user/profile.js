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

    "blur .userName[data-action=changeUserName]": function(e, t) {
      console.log("changeUsername");
      var newUsername = $(".userName").val();
          if($(".userName").val().length != 0) {
            Meteor.call('user/changeUserName', newUsername, (error, res) => {
              if(error){
                console.log("Invalid");
                $('.Invalid').text("Invalid username");
                $(".Invalid").addClass("invalid_transition");
                $(".userName").focus();
              }
            else{
                $(".userName").val("");
                $('.Invalid').text("Username Changed Successfully");
                $(".Invalid").addClass("invalid_transition");
            }
          });
               $(".Invalid").removeClass("invalid_transition");
               $(".fa").removeClass(hide_icon);
        }

    },

   /* "click .fa": function(e,t){
        $(".userName[data-action=changeUserName]").focus();
        $(".icon_wrapper").addClass(hide_icon);
        //$(".fa-pencil-square-o").remove();
    }*/
});

Template.Profile.helpers({


  getUserName: () => Meteor.userId()? Meteor.user().username : null,

  getEmail: () => Meteor.userId()? Meteor.user().emails[0].address: null,

  getFacebook: () => Meteor.userId()? Meteor.user().socialMedia.facebook: null,

  getGoogle: () => Meteor.userId()? Meteor.user().socialMedia.google: null,

  getGithub: () => Meteor.userId()? Meteor.user().socialMedia.github: null,

  randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null,
  profilePic: () => Meteor.userId()? Spacebars.SafeString(GeoPattern.generate(Meteor.user().profile.profileSeed).toSvg()) : null
});
