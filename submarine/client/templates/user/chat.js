Template.Chats.onRendered(function() {
  var self = this;
  $(".bottom.nav").addClass("hidden");
  Session.set("currentTemplate", "friend_profile");
});

Template.Chats.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
});

Template.Chats.onCreated(function() {
  var self = this;
  self.friendId = FlowRouter.current().params.friendId;
  self.userId = Meteor.userId();

  //subsribe message
  self.limit = new ReactiveVar(25);
  this.autorun(() => {
      this.subscribe('chat/friendChats', null, self.friendId);
    });

});


Template.Chats.events({
  "click .button[data-action=send]": function(){
    var currMessage = $('#msg').val();
    var self = Template.instance();
    console.log("send");
    App.Collections.Message.insert({
      is_public: false,
      sender: self.userId,
      receiver: self.friendId,
      message: currMessage,
      time: new Date(),
      rate: 0
    })
  }
});


Template.Chats.helpers({
  "messages": function() {
    var self = Template.instance();
    return App.Collections.Message.find({
      sender: {
        "$in": [self.userId, self.friendId]
      },
      receiver: {
        "$in": [self.userId, self.friendId]
      }
    }).fetch();
  },

  profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

  friendId: () => FlowRouter.current().params.friendId
});



Template.mainLayout.events({
  "click .info_avatar": function (e, t) {
    var idNumber = t.$(e.currentTarget).data('friendid');
    FlowRouter.go('/user/friend_profile/'+idNumber);
  },
  "click .button.back": function () {
    FlowRouter.go('/user/friends');
  }
});
