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
  },

  friendList: function() {
    //return Meteor.user.friendList;
    return [
      {
        //avatar:

        nickname: "alice",
        name: "user1"
      },
      {
        //avatar:

        nickname: "cherry",
        name: "user2"
      },
      {
        //avatar:

        nickname: "jack",
        name: "user3"
      },
      {
        //avatar:

        nickname: "john",
        name: "user4"
      },
      {
        //avatar:

        nickname: "mary",
        name: "user5"
      },
      {
        //avatar:

        nickname: "lili",
        name: "user6"
      },
      {
        //avatar:

        nickname: "cathy",
        name: "user7"
      }
    ]
  }
})

Template.mainLayout.events({
  "click .connect_profile": function (e, t) {
    var nickn = t.$(e.nickname);
 //   console.log(nickn);
    FlowRouter.go('/user/friend_profile');
  }
});
