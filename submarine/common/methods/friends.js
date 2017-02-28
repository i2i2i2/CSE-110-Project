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
                
                // Add user2 to user1's collection
                if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friends':{'userId':friendId}}]}) == null){
                    console.log("Adding user2 to user1");    
                    Meteor.users.update({_id: userId}, {$push:{"profile.friends":{"userId":friendId}}});
                    // remove user 2 from friend Request
                   if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friendsRequest':{'userId':friendId}}]}) != null){
                        Meteor.users.update({_id: userId},{$pull:{"profile.friendRequest":friendId}});
                    }
                }
                // Add user1 to user2's collection
                if(Meteor.users.findOne({$and:[{_id: friendId},{'profile.friends':{'userId':userId}}]}) == null){
                    console.log("Adding user1 to user2");
                    Meteor.users.update({_id:friendId}, {$push:{"profile.friends":{"userId":userId}}});
                
                }
                
            }
            return true;    
        },
        "friends/dismissFriend" : function(userId, friendId) {
            console.log("on serve, welcome called dismissFriend: ");
            var user1 = Meteor.users.findOne(userId);
            var user2 = Meteor.users.findOne(friendId);
            
            if (user1==null || user2==null) {
                // invalid userid
                console.log("Invalid user or friend id");
                return false;
            }
            else {
                console.log("Dismissing user2 as friends");
                // Add user2 to user1's turndownFriends collection
                if(Meteor.users.findOne({$and:[{_id: userId},{'profile.turndownFriends':{'userId':friendId}}]}) == null){
                    var today = new Date();
                    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
                    
                    Meteor.users.update({_id: userId}, {$push:{"profile.turndownFriends":{"userId":friendId,"validThru":nextweek}}});
                    
                }
                // remove user 2 from friend Request
                if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friendsRequest':{'userId':friendId}}]}) != null){
                        Meteor.users.update({_id: userId},{$pull:{"profile.friendRequest":{"userId":friendId}}});
                }
                
            }
            return true;    
        }
	    
    
	});
  });

