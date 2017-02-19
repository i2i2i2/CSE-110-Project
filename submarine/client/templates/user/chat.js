Template.Chats.onCreated(function() {
  var self = this;
  self.friendId = FlowRouter.current().params.friendId;
  self.userId = Meteor.userId();

 // console.log(self.friendId);
 //console.log(self.userId);
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
  }
});
