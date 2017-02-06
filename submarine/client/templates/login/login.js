Template.Login.onCreated(function() {

  var self = this;  // self is template instance

  // vars attach to the template instance
  self.usernameKeyPress = -1;     // unix timestamp last keypress
  self.emailKeyPress = -1;        // unix timestamp last keypress
  self.passwordKeyPress = -1;

  self.usernameRegex = /^[_]?[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
  self.emailRegex = /.+@(.+){2,}\.(.+){2,}/;

  self.usernameTimeout = -1;
  self.emailTimeout = -1;
  self.passwordTimeout = -1;

  self.usernameErr = true;
  self.emailErr = true;
  self.passwordErr = true;

  // convenience function to display error or approve function
  self.displaySpan = function(type, jDOM, msg) {

    // remove previous span under jDOM
    if (jDOM.find('span').attr('class') == type)
      return;

    jDOM.find('span').remove();

    var html = "<span class=\"" + type + "\">" + (msg? msg : "");

    if (type == "pass")
      html += "<i class=\"fa fa-check-circle\"></i></span>";
    else if (type == "error")
      html += "<i class=\"fa fa-minus-circle\"></i></span>";
    else if (type == "load")
      html += "<i class=\"fa fa-refresh fa-spin\"></i></span>";

    jDOM.append(html);
  };

  self.checkUsername = function() {
    var username = self.$("#username_signup").val();
    if (!username.length) {
      self.$("#username_signup").siblings().remove();
      return;
    } else if (username.length < 5) {
      self.displaySpan("error", self.$("#username_signup").parent(), "Too Short");
      return;
    }

    // test with regex
    if (self.usernameRegex.test(username)) {
      Meteor.call("user/checkUsername", username, (err) => {
        if (err) {
          self.displaySpan("error", self.$("#username_signup").parent(), "Username Exists");
        } else {
          self.displaySpan("pass", self.$("#username_signup").parent());
        }
      })
    } else {
      self.displaySpan("error", self.$("#username_signup").parent(), "Invalid Character");
    }
  }

  self.checkEmail = function() {
    var email = self.$("#email_signup").val();
    if (!email.length) {
      self.$("#email_signup").siblings().remove();
      return;
    }

    // test with regex
    if (self.emailRegex.test(email)) {
      Meteor.call("user/checkEmail", email, (err) => {
        if (err) {
          self.displaySpan("error", self.$("#email_signup").parent(), "Email Exists");
        } else {
          self.displaySpan("pass", self.$("#email_signup").parent());
        }
      })
    } else {
      self.displaySpan("error", self.$("#email_signup").parent(), "Invalid Email");
    }
  }

  self.checkPassword = function() {
    var password = self.$("#password_signup").val();
    if (!password.length) {
      self.$("#password_signup").siblings().remove();
      return;
    }

    if (password.length < 8) {
      self.displaySpan("error", self.$("#password_signup").parent(), "Too Short")
    } else {
      self.displaySpan("pass", self.$("#password_signup").parent());
    }
  }
});



Template.Login.events({

  // switch to sign in
  "click .button[data-action=switch]": function(e, t) {
    t.$('.lower, .upper').toggleClass('signup')
                         .toggleClass('login')
  },

  // sign up
  "click .button[data-action=signup]": function(e, t) {
    var username = t.$("#username_signup").val();
    if (!username.length) {
      t.displaySpan("error", t.$("#username_signup").parent(), "Username Missing");
    }

    var email= t.$("#password_signup").val();
    if (!email.length) {
      t.displaySpan("error", t.$("#email_signup").parent(), "Email Missing");
    }

    var password = t.$("#password_signup").val();
    if (!password.length) {
      t.displaySpan("error", t.$("#password_signup").parent(), "Password Missing");
    }


    var errors = t.$("span.error, span.load");
    if (errors.length) {
      t.$(".error, .load").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    } else {
      var username = t.$("#username_signup").val();
      var email = t.$("#email_signup").val();
      var password = t.$("#password_signup").val();

      Accounts.createUser({
        username: username,
        email: email,
        password: password
      }, (err) => {
        t.$("form.signup").append("<p class=\"error\">Unknown Error, Please Contact Us.</p>");
      });

      $(e.currentTarget).html("<i class=\"fa fa-refresh fa-spin\"></i></span>");
    }
  },

  // sign in
  "click .button[data-action=login]": function(e, t) {
    var username = t.$("#username_login").val();
    if (!username.length) {
      t.displaySpan("error", t.$("#username_login").parent(), "Username Missing");
      return;
    }

    var password = t.$("#password_login").val();
    if (!password.length) {
      t.displaySpan("error", t.$("#password_login").parent(), "Password Missing");
      return;
    }

    Meteor.loginWithPassword(username, password, (err) => {
      $(e.currentTarget).html("Log In");
      if (err.reason == "User not found")
        t.displaySpan("error", t.$("#username_login").parent(), err.reason);

      else if (err.reason == "Incorrect password")
        t.displaySpan("error", t.$("#password_login").parent(), err.reason);
    });

    $(e.currentTarget).html("<i class=\"fa fa-refresh fa-spin\"></i></span>");
  },

  // when user focus input, remove any error message
  "focus input": function(e, t) {
    // remove nearby error message
    $(e.currentTarget).siblings().remove();
    $(e.currentTarget).val('');
  },

  // on keypress set a timeout to check user input
  "keydown #username_signup": function(e, t) {
    t.usernameErr = true;
    t.displaySpan("load", $(e.currentTarget).parent());

    var now = Date.now().value;

    if (!t.usernameKeyPress) {
      t.usernameKeyPress = now;
    }
    else if (now - t.usernameKeyPress < 1000) {
      t.usernameKeyPress = now;
      clearTimeout(t.usernameTimeout);
    }

    t.usernameTimeout = setTimeout(t.checkUsername, 1000);
  },

  // on keypress set a timeout to check user input
  "keydown #email_signup": function(e, t) {
    t.emailErr = true;
    t.displaySpan("load", $(e.currentTarget).parent());

    var now = Date.now().value;

    if (!t.emailKeyPress) {
      t.emailKeyPress = now;
    }
    else if (now - t.emailKeyPress < 1000) {
      t.emailKeyPress = now;
      clearTimeout(t.emailTimeout);
    }

    t.emailTimeout = setTimeout(t.checkEmail, 1000);
  },

  // on keypress set a timeout to check user input
  "keydown #password_signup": function(e, t) {
    t.passwordErr = true;
    t.displaySpan("load", $(e.currentTarget).parent());

    var now = Date.now().value;

    if (!t.passwordKeyPress) {
      t.passwordKeyPress = now;
    }
    else if (now - t.passwordKeyPress < 1000) {
      t.passwordKeyPress = now;
      clearTimeout(t.passwordTimeout);
    }

    t.passwordTimeout = setTimeout(t.checkPassword, 1000);
  }
});
