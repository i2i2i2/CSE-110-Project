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
    if(Meteor.user().profile.friends == null || Meteor.user().profile.friends.length == 0) {
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

  getName: (friend) => friend.nickname? friend.nickname: Meteor.users.findOne(friend.userId).username,

  friendChatList: () => {
    var latestMsg = Session.get("latestMsg");
    var friends = Meteor.user().profile.friends;

    if (!latestMsg) return friends;

    friends = friends.map((friend) => {
      if (latestMsg[friend.userId]) {
        friend.message = latestMsg[friend.userId].message;
        friend.time = latestMsg[friend.userId].time;
      }
      return friend;
    }).filter(friend => !!friend.time).sort(function(friend1, friend2) {
      return -friend1.time.getTime() + friend2.time.getTime();
    });

    return friends;
  },

  friendAlphaList: () => {
    var list = Meteor.userId()? Meteor.user().profile.friends : null;
    if (!list || !list.length) return;

    list.sort(function(friend1, friend2) {
      var name1 = Meteor.users.findOne(friend1.userId).username;
      var name2 = Meteor.users.findOne(friend2.userId).username;
      return name1 > name2;
    });

    console.log(list);
    return list;
  },
  getTime: (time) => {
    return moment(time).format("HH:mm");
  }
});

Template.Friends.events({
  "click .connect_profile": function (e, t) {
    var idNumber = t.$(e.currentTarget).data('userid');
    FlowRouter.go('/user/friend_profile/'+idNumber);
  },

  "click .cancel": function () {
    $('#paragraph_text').val('');
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
    var friendId = t.$(e.currentTarget).data('userid');
    Meteor.call('friends/dismissFriend',selfId,friendId);
  },

  "click .accept": function (e, t) {
    var selfId = Meteor.userId();
    var friendId = t.$(e.currentTarget).data('userid');
    Meteor.call('friends/addFriend',selfId,friendId);
  },

  "click .switch": function(e, t) {
    $(".friendList").toggleClass("alpha");
  }
});
