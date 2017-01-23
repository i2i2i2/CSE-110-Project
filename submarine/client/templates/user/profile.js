Template.Profile.onRendered(function() {
  Session.set("currentTemplate", "profile");
});

Template.Profile.events({
  "click .button[data-action=logout]": function(e, t) {
    Meteor.logout();
  }
})
