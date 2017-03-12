Template.Profile.onCreated(function() {

  this.displaySpan = function(parent, msg, isErr) {
    parent.append('<div class="' + (isErr ? "error" : "pass") + '">'
                  + (isErr ? '<i class="fa fa-minus-circle"></i>' : '<i class="fa fa-check-circle"></i>')
                  + msg + '</div>');
    var span;
    if (isErr)
      span = parent.find(".error");
    else
      span = parent.find(".pass");

    span.fadeOut(400).fadeIn(400).fadeOut(400);
    setTimeout(function() {
      span.remove();
    }, 1200);
  }
});

Template.Profile.onRendered(function() {
  Session.set("currentTemplate", "profile");
});

Template.Profile.events({
  "click .button.logout": function(e, t) {
    Meteor.logout();
  },

  "click .button.random": function(e, t) {
    console.log("randomed");
    Meteor.call('user/rollProfilePicture', (err, res) => {
      $('.button[data-action=random]').removeClass('active');
    });

    $('.button[data-action=random]').addClass('active');
  },

  "click .fa-pencil": function(e, t) {
    // change wrapper to editing
    console.log("click pencil");
    var wrapper = $(e.currentTarget).parent();
    wrapper.addClass("editting");

    if (wrapper.hasClass("change_wrapper")) {
      $(".top_wrapper").addClass("hidden");
      $(".private_concern").addClass("fix");
    }

    // focus to input
    var input = wrapper.find("input");
    input.prop("disabled", false);
    input.focus();
  },

  "click .fa-check-circle-o": function(e, t) {
    console.log("clicked");

    var self = Template.instance();
    var wrapper = $(e.currentTarget).parent();
    var input = wrapper.find("input");

    if (input.hasClass("email")) {

      console.log("changeEmail");
      var newEmail = $('.email').val();
      var regexpEmail = /.+@(.+){2,}\.(.+){2,}/;

      if (!regexpEmail.test(newEmail)) {
        self.displaySpan(wrapper, "Invalid Email", true);

      } else {
        wrapper.addClass("load");
        Meteor.call('user/changeEmail', newEmail, (err, res) => {
          if (err) {
            self.displaySpan(wrapper, "Email Existed", true);
            $('.email').val("");
          } else {
            self.displaySpan(wrapper, "Updated", false);
          }
          wrapper.removeClass("load");
        });

      }

    } else if (input.hasClass("facebook")) {
      console.log("facebook");
      var newFacebook = $('.facebook').val();
      console.log(newFacebook.length);
      if (!newFacebook.length) {
        self.displaySpan(wrapper, "Empty Entry", true);
        return;
      }

      wrapper.addClass("load");

      $.ajax({
        url: "https://graph.facebook.com/" + newFacebook
      }).always(function(data) {
        if (data.responseJSON.error.message.substr(0, 11) == "(#803) Some") {
          self.displaySpan(wrapper, "User Not Found", true);
          $('.facebook').val(self.facebook);
          wrapper.removeClass("load");

        } else {
          Meteor.call('user/changeFacebook', newFacebook, (err, res) => {
            if (err) {
              self.displaySpan(wrapper, "Internal Error", true);
              $('.facebook').val("");
            } else {
              self.displaySpan(wrapper, "Updated", false);
            }

            wrapper.removeClass("load");
          });
        }
      });

    } else if (input.hasClass("github")) {

      console.log("changeGithub");
      var newGithub = $('.github').val();
      if (!newGithub.length) {
        self.displaySpan(wrapper, "Empty Entry", true);
        return;
      }

      wrapper.addClass("load");
      $.ajax({
        url: "https://api.github.com/search/users?q=" + newGithub
      }).always(function(data) {
        if (data.total_count != 1) {
          self.displaySpan(wrapper, "User Not Found", true);
          $('.github').val(self.github);
          wrapper.removeClass("load");

        } else {
          Meteor.call('user/changeGithub', newGithub, (err, res) => {
            if (err) {
              self.displaySpan(wrapper, "Internal Error", true);
              ('.github').val("");
            } else {
              self.displaySpan(wrapper, "Updated", false);
            }

            wrapper.removeClass("load");
          });
        }
      });

    } else if (input.hasClass("userName")) {

      console.log("changeUsername");
      var newUsername = $(".userName").val();
      if(newUsername.length < 6 || !/^[_]?[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(newUsername)) {
        self.displaySpan(wrapper, "Invalid Username", true);

      } else {
        wrapper.addClass("load");
        Meteor.call('user/changeUserName', newUsername, (error, res) => {
          if(error){
            self.displaySpan(wrapper, "Username Exists", true);
            $(".userName").val("");
          } else{
            self.displaySpan(wrapper, "Updated", false);
          }

          wrapper.removeClass("load");
        });
      }
    }
  },

  "blur input": function(e, t) {
    var input = $(e.currentTarget);
    var wrapper = input.parent();
    var self = Template.instance();

    input.prop("disabled", true);
    setTimeout(function() {
      $(".top_wrapper").removeClass("hidden");
      $(".private_concern").removeClass("fix");
      wrapper.removeClass("editting");
      if (!wrapper.hasClass("load")) {
        input.val("");
      }
    }, 100);
  }
});

Template.Profile.helpers({

  "hasFacebook": function() {
      if(Meteor.userId() && Meteor.user().profile.socialMedia != null) {
        if(Meteor.user().profile.socialMedia.facebook != null)
            return true;
      }
  },

  "hasGithub": function() {
      if(Meteor.userId() && Meteor.user().profile.socialMedia != null) {
        if(Meteor.user().profile.socialMedia.github != null)
            return true;
      }
  },

  getUserName: () => {
    var self = Template.instance();
    var username = Meteor.userId()? Meteor.user().username : null;
    $(".userName").val("");
    return username;
  },

  getEmail: () => {
    var self = Template.instance();
    var email = Meteor.userId()? Meteor.user().emails[0].address: null;
    $(".email").val("");
    return email;
  },

  getFacebook: () => {
    var self = Template.instance();
    var facebook = Meteor.userId()? Meteor.user().profile.socialMedia.facebook: null;
    return facebook;
  },

  getGithub: () => {
    var self = Template.instance();
    var github = Meteor.userId()? Meteor.user().profile.socialMedia.github: null;
    return github;
  },

  randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null
});
