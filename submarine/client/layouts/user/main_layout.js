Template.mainLayout.onCreated(() => {
  var self = this;
  console.log("Welcome Back!");
  Tracker.autorun(function() {
    if (!Meteor.userId()) {
      FlowRouter.go("/");
    }
  });
});

Template.mainLayout.onRendered(function() {
  var self = this;
  console.log("Now you see me.");
  self.autorun(function() {
    var currentTemplate = Session.get("currentTemplate");
    self.$(".button").removeClass("active");
    self.$(".button[data-link=" + currentTemplate + "]").addClass("active");
    console.log("class added");
  });
});

Template.mainLayout.events({
  "click .button": function (e, t) {
    var link = t.$(e.currentTarget).data('link');

    if (!link) return;

    FlowRouter.go('/user/' + link);
  }
});

Template.mainLayout.helpers({
  "username": function() {
    return Meteor.user()? Meteor.user().username : null;
  }
})
