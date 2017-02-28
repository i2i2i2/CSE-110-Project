// add friends, delete friends and update friends info


Meteor.methods({
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
			if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friends.userId':friendId}]}) == null){
				console.log("Adding user2 to user1");    
				Meteor.users.update({_id: userId}, {$push:{"profile.friends":{"userId":friendId}}});
				// remove user 2 from friend Request
			   if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friendRequest.userId':friendId}]}) != null){
				 Meteor.users.update({_id: userId},{$pull:{"profile.friendRequest":{"userId":friendId}}});  
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
			if(Meteor.users.findOne({$and:[{_id: userId},{'profile.turndownFriends.userId':friendId}]}) == null){
				var today = new Date();
				var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
				
				Meteor.users.update({_id: userId}, {$push:{"profile.turndownFriends":{"userId":friendId,"validThru":nextweek}}});
				
			}
			// remove user 2 from friend Request
			if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friendRequest.userId':friendId}]}) != null){
				console.log("removing user 2 from friend request array");
				Meteor.users.update({_id: userId},{$pull:{"profile.friendRequest":{"userId":friendId}}});
			}
			
			}
			return true;    
		},

		"friends/ignoreRecommendation" : function(userId, friendId) {
			console.log("on serve, welcome called ignoreRecommendation: ");
			var user1 = Meteor.users.findOne(userId);
			var user2 = Meteor.users.findOne(friendId);
			
			if (user1==null || user2==null) {
			// invalid userid
			console.log("Invalid user or friend id");
			return false;
			}
			else {
			console.log("removing user 2 from recommend");
			// if user 2 is not blocking user 1, add user 1 to user 2's db

			Meteor.users.update({_id: userId},{$pull:{"profile.recommendedFriends":{"userId":friendId}}});
			
			}
			return true;    
		},

		// user 1 send friend request to user 2
		// Todo: turndownFriends update
		"friends/sendRequest" : function(userId, friendId, message) {
			console.log("on serve, welcome called sendRequest: ");
			var user1 = Meteor.users.findOne(userId);
			var user2 = Meteor.users.findOne(friendId);
			
			if (user1==null || user2==null) {
			// invalid userid
			console.log("Invalid user or friend id");
			return false;
			}
			else {
			console.log("Sending user 2 request");
			// if user 2 is not blocking user 1, add user 1 to user 2's db
			if(Meteor.users.findOne({$and:[{_id: friendId},{'profile.turndownFriends.userId':userId}]}) == null){
				console.log("letting the friend know your request");
				Meteor.users.update({_id: friendId}, {$push:{"profile.friendRequest":{"userId":friendId,"requestReason":message}}});
				
			}
			// remove user 2 from user 1's recommended list
			console.log("removing recommended friend from db");
			Meteor.users.update({_id: userId},{$pull:{"profile.recommendedFriends":{"userId":friendId}}});
			
			}
			return true;    
		},

		// call this function if and only if user 1 and user 2 are already friends
		// Not implement this prerequisite yet
		"friends/editNickname" : function(userId, friendId, name){
			console.log("on serve, welcome called editNickname: ");
			var user1 = Meteor.users.findOne(userId);
			var user2 = Meteor.users.findOne(friendId);
			
			if (user1==null || user2==null) {
			// invalid userid
			console.log("Invalid user or friend id");
			return false;
			}
			else {
			console.log("Editting nickname of user 2");
			// check whether there are friends
			if(Meteor.users.findOne({$and:[{_id: userId},{'profile.friends.userId':friendId}]}) != null){
				// add nickname entry     
				Meteor.users.update({_id: userId,"profile.friends.userId":friendId}, {$set:{"profile.friends.$.nickname":name}});
				
			}
			   
			
			}
			return true;    
		}	

});

