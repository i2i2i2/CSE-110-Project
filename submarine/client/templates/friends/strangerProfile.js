Template.StrangerProfile.onRendered(function() {
  var self = this;
  $(".bottom.nav").addClass("hidden");
  Session.set("currentTemplate", "friend_profile");
});

Template.StrangerProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
});

Template.StrangerProfile.helpers({
  userId: () => FlowRouter.current().params._id,
  profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

  getName: function(id, nickname){
      var name = Meteor.users.findOne(id).username;
      if (nickname){
        var friendsList = Meteor.user().profile.friends;
        var friendId = FlowRouter.current().params._id;
        for(var i=0; i<friendsList.length;i++){

          if (friendsList[i].userId == friendId) {
            return friendsList[i].nickname;
          }
        }
      }
      return name;
  }

});

Template.StrangerProfile.events({
  "click .button_back": function (e, t) {
    FlowRouter.go('/user/home/');
  },
  "click .chat.button": function (e,t) {
    var id = t.$(e.currentTarget).data('id');
    FlowRouter.go('/chats/friend/'+id);
  },
 /* "click .add_friend.button": function (e,t) {
     var id = t.$(e.currentTarget).data('id');

    self.friendId = t.$(e.currentTarget).data('userid');
    $(".popAdd").css({"display": "block"});
  }*/

});
