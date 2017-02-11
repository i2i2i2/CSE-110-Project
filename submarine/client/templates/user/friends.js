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
  },

  requests: function() {
    // return Meteor.user.profile.requests;
    return [
      {
        name: "user1",
        description: "World"
      },
      {
        name: "user2",
        description: "World1"
      },
      {
        name: "user3",
        description: "World2"
      }
    ]
  }
})
