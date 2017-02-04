Template.Login.onCreated(function() {

  var self = this;  // self is template instance

  // vars attach to the template instance
  self.usernameKeyPress = -1;     // unix timestamp last keypress
  self.emailKeyPress = -1;        // unix timestamp last keypress

  self.usernameRegex = App.Services.Users.usernameRegex;
  self.emailRegex = /.+@(.+){2,}\.(.+){2,}/;

  self.usernameTimeout = -1;
  self.emailTimeout = -1;

  // convenience function to display error or approve function
  self.displaySpan = function(type, jDOM, msg) {

    // remove previous span under jDOM
    jDOM.remove('span');

    var html = "<span class=\"" + type + "\">" + msg? msg : "";

    if (type == "pass")
      html += "<i class=\"fa fa-check-circle\"></i></span>";
    else if (type == "error")
      html += "<i class=\"fa fa-minus-circle\"></i></span>";
    else if (type == "load")
      html += "<i class=\"fa fa-refresh fa-spin\"></i></span>";

    jDOM.append(html);
  };
});

Template.login.events({

  // switch to sign in
  "click .button[data-action=switch]": function(e, t) {
    t.$('.lower, .upper').toggleClass('signup')
                         .toggleClass('login')
                         .removeClass('forgetPwd');
  },

  // sign up
  "click .button[data-action=signup]": function(e, t) {

  },

  // sign in
  "click .button[data-action=login]": function(e, t) {

  }

});
