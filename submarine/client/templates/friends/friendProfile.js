Template.FriendProfile.onRendered(function() {
  var self = this;
  $(".bottom.nav").addClass("hidden");
  Session.set("currentTemplate", "friend_profile");
});


Template.FriendProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
});
