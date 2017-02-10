Template.Friends.onRendered(function() {
  var self = this;

  Session.set("currentTemplate", "friends");
});

Template.Friends.helpers({
  recommendations: function() {
    // return Meteor.user.profile.recommedations;
    return [
      {
        name: "Hello",
        description: "World"
      },
      {
        name: "Hello1",
        description: "World1"
      },
      {
        name: "Hello2",
        description: "World2"
      }
    ]
  }
})
