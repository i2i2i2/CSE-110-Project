// add friends, delete friends and update friends info


Meteor.startup(function () {
	Meteor.methods({
        //Save one more message entry to db
        // Called in client chat.js and  tagChat.js
        "friends/sendMessage": function (userId, friendId, currMessage) {
		  console.log('on server, welcome called sendMessage: '); App.Collections.Message.insert({
            is_public: false,
            sender: userId,
            receiver: friendId,
            message: currMessage,
            time: new Date(),
            rate: 0
        });
        },
        // Add  friend id  to  each person's db
        "friends/addFriend" : function(userId, friendId) {
            console.log("on serve, welcome called addFriend: ");
            var user1 = Meteor.users.findOne(userId);
            var user2 = Meteor.users.findOne(friendId);
            
            if (user1==null || user2==null) {
                // invalid userid
                console.log("Invalid user or friend id");
                return false;
            }
            else {
                console.log("Adding two users as friends");
                // Add user2 to user1's collection
                if(Meteor.users.findOne({"profile.friends":{"userId":friendId}}) == null){
                    Meteor.users.update({_id: userId}, {$push:{"profile.friends":{"userId":friendId}}});
                    // remove user 2 from friend Request
                    if(Meteor.users.findOne({"profile.friendRequest":friendId}) != null){
                        Meteor.users.update({_id: userId},{$pull:{"profile.friendRequest":friendId}});
                    }
                
                }
                // Add user1 to user2's collection
                if(Meteor.users.findOne({"profile.friends":{"userId":userId}}) == null){
                    Meteor.users.update({_id:friendId}, {$push:{"profile.friends":{"userId":userId}}});
                
                }
                
            }
            return true;    
        }
	    
    
	});
  });

