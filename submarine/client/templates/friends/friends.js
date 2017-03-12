Template.Friends.onRendered(function() {
  var self = this;
  self.displayPopUp = function(message) {
    $("body").append('<p class="popup">' + message + '</p>');
    $(".popup").delay(1000).fadeOut(400);

    setTimeout(function() {
      $(".popup").remove();
    }, 1400);
  }
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


  getName: (friend) => {
    if (friend.nickname) {
      return friend.nickname;
    } else {
      var user = Meteor.users.findOne(friend.userId);
      if (user) return user.username;
      else return "";
    }
  },

  emptyChat: () => {
    var latestMsg = Session.get("latestMsg");
    var friends = Meteor.user().profile.friends;

    if (!latestMsg) return true;

    friends = friends.map((friend) => {
      if (latestMsg[friend.userId]) {
        friend.time = latestMsg[friend.userId].time;
      }
      return friend;
    }).filter(friend => !!friend.time);

    return !friends.length;
  },

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

    return list;
  },
  getTime: (time) => {
    return moment(time).format("HH:mm");
  }
});

Template.Friends.events({
  "click .connect_profile": function (e, t) {
    var idNumber =e.currentTarget.dataset.userid;
    FlowRouter.go('/user/friend_profile/'+idNumber);
  },

  "click .add": function (e, t) {
    var self = Template.instance();
    var friendId = e.currentTarget.dataset.userid;
    console.log(friendId);
    $(e.currentTarget).find(".fa-plus").removeClass("fa-plus").addClass("fa-spin").addClass("fa-circle-o-notch");
    Meteor.call('friends/sendRequest', friendId, function(err, res) {

      self.displayPopUp("Friend Request Sent");
      $(e.currentTarget).find(".fa-spin").removeClass("fa-spin").removeClass("fa-circle-o-notch").addClass("fa-plus");
    });
  },

  "click .ignore": function (e, t) {
    var self = Template.instance();
    var friendId = e.currentTarget.dataset.userid;
    $(e.currentTarget).find(".fa-close").removeClass("fa-close").addClass("fa-spin").addClass("fa-circle-o-notch");
    Meteor.call('friends/ignoreRecommendation', friendId, function(err, res) {

      self.displayPopUp("Recommendation Dismissed");
      $(e.currentTarget).find(".fa-spin").removeClass("fa-spin").removeClass("fa-circle-o-notch").addClass("fa-close");
    });
  },

  "click .dismiss": function (e, t) {
    var self = Template.instance();
    var friendId = e.currentTarget.dataset.userid;
    $(e.currentTarget).find(".fa-times").removeClass("fa-plus").addClass("fa-spin").addClass("fa-circle-o-notch");
    Meteor.call('friends/dismissFriend', friendId, function(err, res) {

      self.displayPopUp("Friend Request Blocked");
      $(e.currentTarget).find(".fa-spin").removeClass("fa-spin").removeClass("fa-circle-o-notch").addClass("fa-times");
    });
  },

  "click .accept": function (e, t) {
    var self = Template.instance();
    var friendId = e.currentTarget.dataset.userid;
    $(e.currentTarget).find(".fa-check").removeClass("fa-plus").addClass("fa-spin").addClass("fa-circle-o-notch");
    Meteor.call('friends/addFriend', friendId, function(err, res) {

      self.displayPopUp("Friend Added");
      $(e.currentTarget).find(".fa-spin").removeClass("fa-spin").removeClass("fa-circle-o-notch").addClass("fa-check");
    });
  },

  "click .switch": function(e, t) {
    $(".friendList").toggleClass("alpha");
  }
});
