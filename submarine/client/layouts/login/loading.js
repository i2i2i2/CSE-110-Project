Template.Loading.onCreated(function() {
  if (Meteor.userId()) FlowRouter.go("/user/home");
})

Template.Loading.helpers({
  logined: () => (Meteor.userId() != null)
})

Template.Loading.events({
  'click .debug.button': function(e, t) {
    FlowRouter.go('/debug');
  }
})
