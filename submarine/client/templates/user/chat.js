Template.Chats.onCreated(function() {
  var self = this;
  self.friendId = FlowRouter.current().params.friendId;
  self.userId = Meteor.userId();

  console.log(self.friendId);
  console.log(self.userId);
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
  }
})
