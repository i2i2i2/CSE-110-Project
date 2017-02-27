Meteor.publish("chat/friendChats", function(limit, friendId) {
  var selector = {
    is_public: false,
    sender: {
      "$in": [this.userId, friendId]
    },
    receiver: {
      "$in": [this.userId, friendId]
    }
  };

  return App.Collections.Message.find(selector, {
    limit: limit,
    sort: {time: -1}
  });
});

Meteor.publish("chat/tagChats", function(tagId) {

  var selector = {
    is_public: true,
    receiver: tagId,
    time: {
      $gte: new Date()
    }
  };

  return App.Collections.Message.find(selector, {sort: {time: -1}});
});
