Meteor.publish("chat/friendChats", function(limit, query) {
  var selector = {
    is_public: false,
    sender: {
      "$in": [this.userId, query.friendId] 
    },
    receiver: {
      "$in": [this.userId, query.friendId]
    }
  };
  
  return App.Collections.Message.find(selector, {
    limit: limit,
    sort: {time: 1}
  });
});