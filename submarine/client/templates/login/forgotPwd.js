Template.ForgotPassword.onCreated(function() {

  var self = this;  // self is template instance

  // vars attach to the template instance
  self.emailKeyPress = -1;        // unix timestamp last keypress
  self.passwordKeyPress = -1;

  self.emailRegex = /.+@(.+){2,}\.(.+){2,}/;

  self.emailTimeout = -1;
  self.passwordTimeout = -1;

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


  self.checkEmail = function() {
    var email = self.$("#email_send_token").val();
    if (!email.length) {
      self.$("#email_send_token").siblings().remove();
      return;
    }

    // test with regex
    if (self.emailRegex.test(email)) {
      Meteor.call("user/checkEmail", email, (err) => {
        if (err) {
          self.displaySpan("pass", self.$("#email_send_token").parent());
        } else {
          self.displaySpan("error", self.$("#email_send_token").parent(), "Email Unregistered");
        }
      })
    } else {
      self.displaySpan("error", self.$("#email_send_token").parent(), "Invalid Email");
    }
  }

  self.checkToken = function() {
    var token = self.$("#token_verify_token").val();
    if (!token.length) {
      self.$("#token_verify_token").siblings().remove();
      return;
    }
  }

  self.checkPassword = function() {
    var password = self.$("#pwd_verify_token").val();
    if (!password.length) {
      self.$("pwd_verify_token").siblings().remove();
      return;
    }

    if (password.length < 8) {
      self.displaySpan("error", self.$("#pwd_verify_token").parent(), "Too Short")
    } else {
      self.displaySpan("pass", self.$("#pwd_verify_token").parent());
    }
  }
});



Template.ForgotPassword.events({

  // switch to send token
  "click .button[data-action=switch]": function(e, t) {
    t.$('.lower, .upper').toggleClass('send_token')
                         .toggleClass('verify_token')
  },

  // send token
  "click .button[data-action=send_token]": function(e, t) {
    var email = t.$("#email_send_token").val();
    if (!email.length) {
      t.displaySpan("error", t.$("#email_send_token").parent(), "Email Missing");
    } else{
        t.$("#email_send_token").parent().find("span").remove();
    }

    var errors = t.$("span.error, span.load");
    if (errors.length) {
      errors.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    } else {

      var email = t.$("#email_send_token").val();

      Accounts.forgotPassword({
        email: email,
      }, (err) => {
          if(err){
            t.$("form.send_token").append("<p class=\"error\">Unknown Error, Please Contact Us.</p>");
            $("#email_send_button").text("Error Occured");
          } else {
            t.$("form.send_token").find("p").remove();
            $("#email_send_button").text("Email Sent");
          }
      });

      $(e.currentTarget).html("<i class=\"fa fa-refresh fa-spin\"></i></span>");
    }
  }
    ,

  // verify token
  "click .button[data-action=verify_token]": function(e, t) {
    var token = t.$("#token_verify_token").val();
    if (!token.length) {
      t.displaySpan("error", t.$("#token_verify_token").parent(), "Token Missing");
    } else{
        t.$("#token_verify_token").parent().find("span").remove();
    }

    var password = t.$("#pwd_verify_token").val();
    if (!password.length) {
      t.displaySpan("error", t.$("#pwd_verify_token").parent(), "Password Missing");
    } else{
        t.$("#pwd_verify_token").parent().find("span").remove();
    }

    var errors = t.$("span.error, span.load");

    if (errors.length) {
      errors.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    } else {
        Accounts.resetPassword(token,password,
        (err) =>{
            if(err){
                console.log(err)
                t.displaySpan("error", t.$("#token_verify_token").parent(), "Invalid Token");
                $(".error").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            } else {
                $("#pwd_reset_button").text("Password reset!");
            }
        });

        //$(e.currentTarget).html("<i class=\"fa fa-refresh fa-spin\"></i></span>");
    }
  },

  // when user focus input, remove any error message
  "focus input": function(e, t) {
    // remove nearby error message
    $(e.currentTarget).siblings().remove();
    $(e.currentTarget).val('');
  },

  // on keypress set a timeout to check user input
  "keydown #email_send_token": function(e, t) {
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
  "keydown #pwd_verify_token": function(e, t) {
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
