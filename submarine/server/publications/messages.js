// publish chat history between users
Meteor.publish("messages/friendHistory", function(userId, friendId, fromDate) {
  return App.Collections.Message.find({
                                        "is_public": false,
                                        "time": {"$gte": fromDate},
                                        "sender": {"$in": [userId, friendId]},
                                        "receiver": {"$in": [userId, friendId]}
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
