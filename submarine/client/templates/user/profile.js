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

  "click .fa[data-action=changeEmail]": function(e, t) {

    console.log("changeEmail");
    var newEmail = $('.email').val();
    var regexpEmail = /.+@(.+){2,}\.(.+){2,}/;
    if (regexpEmail.test(newEmail)){
      $('.checkEmail').removeClass("check_transition");
      $('.checkEmail').text("Changed Successfully");

     // $('.checkEmail').addClass("check_transition");
      Meteor.call('user/changeEmail', newEmail, (err, res) => {
              $('.fa[data-action=changeEmail]').removeClass('active');
      });
      $('.email').val("");
      $('.fa[data-action=changeEmail]').addClass('active');
    }
    else{
        console.log("Invalid");
        $('.checkEmail').removeClass("check_transition");
        $('.checkEmail').text("Invalid Email");
        $('.email').focus();
    }
    $('.checkEmail').addClass("check_transition");
    },

    "click .fa[data-action=changeFacebook]": function(e, t) {

    console.log("changeFacebook");
    var newFacebook = $('.facebook').val();

     /* Meteor.call('user/changeFacebook', newFacebook, (err, res) => {
              $('.fa[data-action=changeEmail]').removeClass('active');
      });*/
      $('.checkFacebook').addClass("check_transition");
      $('.checkFacebook').text("Changed Successfully");
      $('.facebook').val("");
      //$('.checkFacebook').removeClass("check_transition");
      $('.fa[data-action=changeEmail]').addClass('active');
    },

    "click .fa[data-action=changeGoogle]": function(e, t) {

    console.log("changeGoogle");
    var newFacebook = $('.google').val();

     /* Meteor.call('user/changeGoogle', newGoogle, (err, res) => {
              $('.fa[data-action=changeGoogle]').removeClass('active');
      });*/
      $('.checkGoogle').addClass("check_transition");
      $('.checkGoogle').text("Changed Successfully");
      $('.google').val("");
      //$('.checkFacebook').removeClass("check_transition");
      $('.fa[data-action=changeGoogle]').addClass('active');
    },

    "click .fa[data-action=changeGithub]": function(e, t) {

    console.log("changeGithub");
    var newFacebook = $('.github').val();

    /*  Meteor.call('user/changeGithub', newGithub, (err, res) => {
              $('.fa[data-action=changeGithub]').removeClass('active');
      });*/
      $('.checkGithub').addClass("check_transition");
      $('.checkGithub').text("Changed Successfully");
      $('.github').val("");
      //$('.checkFacebook').removeClass("check_transition");
      $('.fa[data-action=changeGithub]').addClass('active');
    },
/*    "click .fa[data-action=changeEmail]": function(e, t) {
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
    },*/

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
              // $(".fa").removeClass(hide_icon);
        }

    },

   /* "click .fa": function(e,t){
        $(".userName[data-action=changeUserName]").focus();
        $(".icon_wrapper").addClass(hide_icon);
        //$(".fa-pencil-square-o").remove();
    }*/
});

Template.Profile.helpers({

  "hasFacebook": function() {
      if(Meteor.user().profile.socialMedia != null) {
        if(Meteor.user().profile.socialMedia.facebook != null)
            return true;
      }
  },

  "hasGoogle": function() {
       if(Meteor.user().profile.socialMedia != null) {
        if(Meteor.user().profile.socialMedia.google)
            return true;
       }
  },

  "hasGithub": function() {
      if(Meteor.user().profile.socialMedia != null) {
        if(Meteor.user().profile.socialMedia.github != null)
            return true;
      }
  },


  getUserName: () => Meteor.userId()? Meteor.user().username : null,

  getEmail: () => Meteor.userId()? Meteor.user().emails[0].address: null,

  getFacebook: () => Meteor.userId()? Meteor.user().profile.socialMedia.facebook: null,

  getGoogle: () => Meteor.userId()? Meteor.user().profile.socialMedia.google: null,

  getGithub: () => Meteor.userId()? Meteor.user().profile.socialMedia.github: null,

  randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null,
  profilePic: () => Meteor.userId()? Spacebars.SafeString(GeoPattern.generate(Meteor.user().profile.profileSeed).toSvg()) : null
});
