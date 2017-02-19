Template.FriendProfile.onRendered(function() {
  var self = this;
  $(".bottom.nav").addClass("hidden");
  Session.set("currentTemplate", "friend_profile");
});

Template.FriendProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
});


Template.FriendProfile.helpers({
  profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

  getName: (id, nickname) => nickname? nickname: Meteor.users.findOne(id).username,

  userId: () => FlowRouter.current().params._id
});

Template.mainLayout.events({
  "click .button_back": function (e, t) {
    var id = t.$(e.currentTarget).data('userid');
    FlowRouter.go('/chats/friend/'+id);
  }
});
