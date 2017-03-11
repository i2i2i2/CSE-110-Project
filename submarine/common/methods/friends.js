// add friends, delete friends and update friends info


Meteor.methods({

  "friends/addStranger": function(userId, friendId) {
    if (this.isSimulation) return;

    console.log("on serve, welcome called addStranger: ");
    var user1 = Meteor.users.findOne(userId);
    var user2 = Meteor.users.findOne(friendId);

    if (user1==null || user2==null) {
      // invalid userid
      console.log("Invalid user or friend id");
      return;
    }
    var today = new Date();
	var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    console.log("Add each other to stranger");
    if(!user1.profile.strangers){
      console.log("for current user, no stranger field in db, add one");
      Meteor.users.update({_id:userId},{$push: {"profile.strangers": {'userId': friendId, 'validThru': nextweek} }}, false, true);
    }
    else{
       Meteor.users.update({_id:userId},{$push: {"profile.strangers": {'userId': friendId, 'validThru': nextweek} }});
    }

    if(!user2.profile.strangers){
      console.log("for target user, no stranger field in db, add one");
      Meteor.users.update({_id:friendId},{$push: {"profile.strangers": {'userId': userId, 'validThru': nextweek} }}, false, true);
    }
    else{
       Meteor.users.update({_id:friendId},{$push: {"profile.strangers": {'userId': userId, 'validThru': nextweek} }});
    }

  },

  // Remove friend from firend list
  "friends/deleteFriend" : function(userId, friendId) {
    if (this.isSimulation) return;
    console.log("on serve, welcome called deleteFriend: ");
    var user1 = Meteor.users.findOne(userId);
    var user2 = Meteor.users.findOne(friendId);

    if (user1==null || user2==null) {
      // invalid userid
      console.log("Invalid user or friend id");
      return;
    }
    else {
      // Remove user2 from user1's collection
      console.log("Deleting user2 from user1");
      Meteor.users.update({_id: userId}, {$pull:{"profile.friends":{"userId":friendId}}});
      // do the other way too.
      console.log("Deleting user1 from user2");
      Meteor.users.update({_id:friendId}, {$pull:{"profile.friends":{"userId":userId}}});
      // Add user 2 to user 1's turndown friends
      if(Meteor.users.findOne({$and:[{_id: userId},{'profile.turndownFriends.userId':friendId}]}) == null){
	var today = new Date();
	var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
	Meteor.users.update({_id: userId}, {$push:{"profile.turndownFriends":{"userId":friendId,"validThru":nextweek}}});

      }
    }

  },

  // Add  friend id  to  each person's db
  "friends/addFriend" : function(userId, friendId) {
    if (this.isSimulation) return;
    console.log("on serve, welcome called addFriend: ");
    var user1 = Meteor.users.findOne(userId);
    var user2 = Meteor.users.findOne(friendId);

    if (user1==null || user2==null) {
      // invalid userid
      console.log("Invalid user or friend id");
      return;
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
  },

"friends/dismissFriend" : function(userId, friendId) {
  if (this.isSimulation) return;
  console.log("on serve, welcome called dismissFriend: ");
  var user1 = Meteor.users.findOne(userId);
  var user2 = Meteor.users.findOne(friendId);

  if (user1==null || user2==null) {
   // invalid userid
   console.log("Invalid user or friend id");
   return;
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
},

  "friends/ignoreRecommendation" : function(userId, friendId) {
    if (this.isSimulation) return;
    console.log("on serve, welcome called ignoreRecommendation: ");
    console.log("on serve, welcome called ignoreRecommendation: ");
    var user1 = Meteor.users.findOne(userId);
    var user2 = Meteor.users.findOne(friendId);

    if (user1==null || user2==null) {
    // invalid userid
    console.log("Invalid user or friend id");
    return;
    }
    else {
      console.log("removing user 2 from recommend");
      // if user 2 is not blocking user 1, add user 1 to user 2's db

      Meteor.users.update({_id: userId},{$pull:{"profile.recommendedFriends":{"userId":friendId}}});

    }
  },

  // user 1 send friend request to user 2
  // Todo: turndownFriends update
  "friends/sendRequest" : function(userId, friendId, message) {
    if (this.isSimulation) return;
    console.log("on serve, welcome called sendRequest: ");
    var user1 = Meteor.users.findOne(userId);
    var user2 = Meteor.users.findOne(friendId);

    if (user1==null || user2==null) {
     // invalid userid
     console.log("Invalid user or friend id");
     return;
    }
    else {
      console.log("Sending user 2 request");
      // if user 2 is not blocking user 1, add user 1 to user 2's db
      if(Meteor.users.findOne({$and:[{_id: friendId},{'profile.turndownFriends.userId':userId}]}) == null){
        console.log("letting the friend know your request");
        if(Meteor.users.findOne({$and:[{_id: friendId},{'profile.friendRequest.userId':userId}]}) == null){
          Meteor.users.update({_id: friendId}, {$push:{"profile.friendRequest":{"userId":userId,"requestReason":message}}});
	}
      }
      // remove user 2 from user 1's recommended list
      console.log("removing recommended friend from db");
      Meteor.users.update({_id: userId},{$pull:{"profile.recommendedFriends":{"userId":friendId}}});

    }
  },

  // call this function if and only if user 1 and user 2 are already friends
  // Not implement this prerequisite yet
  "friends/editNickname" : function(friendId, name){
    if (this.isSimulation) return;

    // check whether there are friends
    var index = 0;
    var friendList = Meteor.user().profile.friends;
    for (index = 0; index < friendList.length; index++) {
      if (friendList[index].userId == friendId) {
        friendList[index].nickname = name;
        break;
      }
    }

    if (index < friendList.length) {
      Meteor.users.update(this.userId, {$set:{"profile.friends": friendList}});
    } else {
      throw new Meteor.Error("Not Friend");
      return;
    }
  }
});
