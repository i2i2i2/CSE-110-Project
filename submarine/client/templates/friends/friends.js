Template.Friends.onRendered(function() {
  var self = this;

  Session.set("currentTemplate", "friends");
});

Template.Friends.helpers({
  recommendations: () => Meteor.userId()?
  Meteor.user().profile.recommendedFriends : null,

  requests: () => Meteor.userId()?
  Meteor.user().profile.friendRequest : null,

  "emptyFriends": function() {
        if(Meteor.user().profile.friends == null || Meteor.user().profile.friends.length === 0) {
            return true;
        }
    },

  hasRecommendation: function() {
    if(Meteor.user().profile.recommendedFriends.length != 0){
      return true;
    }
    return false;
  },

  profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

  getName: (id, nickname) => nickname? nickname: Meteor.users.findOne(id).username,

  friendList: () => Meteor.userId()?
  Meteor.user().profile.friends : null,

})

Template.mainLayout.events({
  "click .connect_profile": function (e, t) {
    var nickn = t.$(e.nickname);
 //   console.log(nickn);
    FlowRouter.go('/user/friend_profile');
  }
});
