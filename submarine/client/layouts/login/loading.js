Template.Loading.helpers({
  logined: () => (Meteor.userId() != null)
})

Template.Loading.events({
  'click .debug.button': function(e, t) {
    FlowRouter.go('/debug');
  }
})
