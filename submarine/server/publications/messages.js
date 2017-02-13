// publish chat history between users
Meteor.publish("messages/friendHistory", function(friendId, fromDate) {
  return App.Collections.Message.find({
                                        "is_public": false,
                                        "time": {"$gte": fromDate},
                                        "sender": {"$in": [this.userId, friendId]},
                                        "receiver": {"$in": [this.userId, friendId]}
                                      }, {"limit": 100});
});

// publish chat history in chatroom
Meteor.publish("messages/chatRoomHistory", function(tagId, fromDate) {
  return App.Collections.Message.find({
                                        "is_public": true,
                                        "time": {"$gte": fromDate},
                                        "receiver": tagId
                                      }, {"limit": 100});
});
