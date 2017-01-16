Tracker.autorun(function () {

  var user = {};

  if (user.isNewUser) {
    FlowRouter.go('loading');
  }
  else {
    FlowRouter.go('userHome');
  }
});
