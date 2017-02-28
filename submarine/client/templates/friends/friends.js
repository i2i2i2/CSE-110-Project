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

  hasRequest: function() {
    if(Meteor.user().profile.friendRequest.length !=0){
      return true;
    }
    return false;
  },

  profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

  getName: (id, nickname) => nickname? nickname: Meteor.users.findOne(id).username,

  friendList: () => Meteor.userId()?
  Meteor.user().profile.friends : null,

});

Template.mainLayout.events({
  "click .connect_profile": function (e, t) {
    var idNumber = t.$(e.currentTarget).data('userid');
    FlowRouter.go('/chats/friend/'+idNumber);
  },

  "click .cancel": function () {
    $(".popAdd").css({"display": "none"});
  },
    
  "click .confirm": function () {
    var selfId = Meteor.userId();
    var message = $('#paragraph_text').val();
    Meteor.call('friends/sendRequest', selfId, self.friendId, message);
    $(".popAdd").css({"display": "none"});
  },


  "click .add": function (e, t) {
    self.friendId = t.$(e.currentTarget).data('userid');
    $(".popAdd").css({"display": "block"});
  },
    
  "click .ignore": function (e, t) {
    var selfId = Meteor.userId();
    var friendId = t.$(e.currentTarget).data('userid');
    console.log(friendId);
    Meteor.call('friends/ignoreRecommendation',selfId,friendId);
  },

  "click .dismiss": function (e, t) {
      var selfId = Meteor.userId();
      var friendId = t.$(e.currentTarget).data('userid'); Meteor.call('friends/dismissFriend',selfId,friendId);
  },

  "click .accept": function (e, t) {
      var selfId = Meteor.userId();
      var friendId = t.$(e.currentTarget).data('userid'); Meteor.call('friends/addFriend',selfId,friendId);
  }
});
