/**
 * Config file for useraccounts package
 * set login/signup/reset password layout and hook fn on user state
 */

// Regex to filter invalid user name
App.Services.Users.usernameRegex = /^[_]?[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
App.Services.Users.usernameRules = 'Username can be letters and numbers, must not have 2 or more hyphens or underscores in a row, must not have an underscore (_) at the end, and must not start or end with a hyphen (-).';

// AccoutsTemplate Configure
AccountsTemplates.configure({
  // behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: false,
  sendVerificationEmail: false,
  lowercaseUsername: true,
  focusFirstInput: true,

  // Appearence
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  //Redirects
  homeRoutePath: '/',
  redirectTimeout: 4000,

  // hook
  // onLogoutHook: myLogoutFunc,
  // onSubmitHook: mySubmitFunc,
  // preSignUpHook: myPreSubmitFunc,

  // Texts
  texts: {
    button: {
      signUp: "Sign Up!",
      signIn: "Log In!"
    },
    title: {
      forgotPwd: "Recover Your Password",
      signUp: "Create a Submarine account",
      signIn: "Board your Submarine"
    },
		signUpLink_pre: "dontHaveAnAccount",
    signUpLink_link: "signUp",
    signUpLink_suff: "",
    errors: {
      accountsCreationDisabled: "Client side accounts creation is disabled!!!",
      cannotRemoveService: "Cannot remove the only active service!",
      captchaVerification: "Captcha verification failed!",
      loginForbidden: "error.accounts.Login forbidden",
      mustBeLoggedIn: "error.accounts.Must be logged in",
      pwdMismatch: "error.pwdsDontMatch",
      validationErrors: "Validation Errors",
      verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",
    }
  }
});

// set what additional info to display on Account Template
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
	{
		_id: "username",
		type: "text",
    displayName: "username",
		required: true,
		minLength: 6,
		maxLength: 20,
		re: App.Services.Users.usernameRegex, // for compatibility with Discourse
    errStr: App.Services.Users.usernameRules
  },
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email'
  }
]);

