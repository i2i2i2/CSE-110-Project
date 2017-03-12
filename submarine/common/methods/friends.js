// add friends, delete friends and update friends info


Meteor.methods({

  "friends/addStranger": function(userId, friendId) {
    if (this.isSimulation) return;
    var friend = Meteor.users.findOne(friendId);
    if (!friend) {
      throw new Meteor.Error("User Not Exists");
      return;
    }
    var otherStrangers = friend.profile.strangers;

    if (!otherStrangers) {
      otherStrangers = [{userId: this.userId, validThru: moment().add(7,"days").toDate()}];
    } else {
      otherStrangers.push({userId: this.userId, validThru: moment().add(7,"days").toDate()});
    }

    var user = Meteor.user();
    var myStrangers = user.profile.strangers;
    if (!myStrangers) {
      myStrangers = [{userId: friendId, validThru: moment().add(7,"days").toDate()}];
    } else {
      myStrangers.push({userId: friendId, validThru: moment().add(7,"days").toDate()});
    }

    Meteor.users.update(this.userId, {
      $set: {
        "profile.strangers": myStrangers,
      }
    });
    Meteor.users.update(friendId, {
      $set: {
        "profile.strangers": otherStrangers,
      }
    });

  },

  // Remove friend from firend list
  "friends/deleteFriend" : function(friendId) {
    if (this.isSimulation) return;

    var friend = Meteor.users.findOne(friendId);
    if (!friend) {
      throw new Meteor.Error("User Not Exists");
      return;
    }
    var otherTurndown = friend.profile.turndownFriends;
    if (otherTurndown) {
      otherTurndown.push({userId: this.userId, validThru: moment().add(7, "days").toDate()});
    } else {
      otherTurndown = [{userId: this.userId, validThru: moment().add(7, "days").toDate()}];
    }
    var otherFriends = friend.profile.friends;
    if (otherFriends)
      otherFriends = otherFriends.filter(user => user.userId != this.userId);

    var user = Meteor.user();
    var myTurndown = user.profile.turndownFriends;
    if (myTurndown) {
      myTurndown.push({userId: friendId, validThru: moment().add(7, "days").toDate()});
    } else {
      myTurndown = [{userId: friendId, validThru: moment().add(7, "days").toDate()}];
    }
    var myFriends = user.profile.friends;
    if (myFriends)
      myFriends = myFriends.filter(user => user.userId != friendId);

    Meteor.users.update(this.userId, {
      $set: {
        "profile.turndownFriends": myTurndown,
        "profile.friends": myFriends
      }
    });
    Meteor.users.update(friendId, {
      $set: {
        "profile.turndownFriends": otherTurndown,
        "profile.friends": otherFriends
      }
    });
  },

  'friends/sendRequest': function(friendId) {
    // check block
    var friend = Meteor.users.findOne(friendId);
    if (!friend) {
      throw new Meteor.Error("User Not Exists");
      return;
    }
    var otherTurndown = friend.profile.turndownFriends;
    if (otherTurndown && otherTurndown.find(user => user.userId == this.userId)) {
      throw new Meteor.Error("You are Blocked");
      return;
    }
    var otherRequest = friend.profile.friendRequest;
    if (!otherRequest) {
      otherRequest = [{userId: this.userId}];
    } else if(! otherRequest.find(user => user.userId == this.userId) ){
      otherRequest.push({userId: this.userId});
    }
      
    var otherRecommend = friend.profile.recommendedFriends;
    if (otherRecommend)
      otherRecommend =  otherRecommend.filter(user => user.userId != this.userId);

    var myRecommend = Meteor.user().profile.recommendedFriends;
    if (myRecommend)
      myRecommend = myRecommend.filter(user => user.userId != friendId);

    Meteor.users.update(this.userId, {
      $set: {
        "profile.recommendedFriends": myRecommend
      }
    });
    Meteor.users.update(friendId, {
      $set: {
        "profile.friendRequest": otherRequest,
        "profile.recommendedFriends": otherRecommend
      }
    });
  },

  "friends/ignoreRecommendation": function(friendId) {
    if (this.isSimulation) return;

    var recommend = Meteor.user().profile.recommendedFriends;
    if (recommend)
      recommend = recommend.filter(user => user.userId != friendId);
    Meteor.users.update(this.userId, {
      $set: {
        "profile.recommendedFriends": recommend
      }
    });

    return;
  },

  // Add  friend id to each person's db
  "friends/addFriend" : function(friendId) {
    if (this.isSimulation) return;

    var user = Meteor.user();
    var myFriends = user.profile.friends;
    var friendRecommend = user.profile.recommendedFriends;
    var friendRequest = user.profile.friendRequest;
    var strangers = user.profile.strangers;
    if (friendRequest)
      friendRequest = friendRequest.filter((user) => (user.userId != friendId));
    if (strangers)
      strangers = strangers.filter(user => user.userId != friendId);
    if (friendRecommend)
      friendRecommend = friendRecommend.filter(user => user.userId != friendId);
    Meteor.users.update(this.userId, {
      $set: {
        "profile.friendRequest": friendRequest,
        "profile.strangers": strangers,
        "profile.friendRecommend": friendRecommend
      }
    });

    var friend = Meteor.users.findOne(friendId);
    if (!friend) {
      throw new Meteor.Error("User Not Existed");
      return;
    }

    if (!myFriends) {
      myFriends = [{userId: friendId}];
    } else {
      myFriends.push({userId: friendId});
    }

    var otherRequest = friend.profile.friendRequest;
    var otherStrangers = friend.profile.strangers;
    var otherRecommends = friend.profile.recommendedFriends;
    if (otherRequest)
      otherRequest = otherRequest.filter(user => user.userId != this.userId);
    if (otherStrangers)
      otherStrangers = otherStrangers.filter(user => user.userId != this.userId);
    if (otherRecommends)
      otherRecommends = otherRecommends.filter(user => user.userId != this.userId);
    var otherFriends = friend.profile.friends;
    if (!otherFriends) {
      otherFriends = [{userId: this.userId}];
    } else {
      otherFriends.push({userId: this.userId});
    }

    Meteor.users.update(this.userId, {$set: {"profile.friends": myFriends}});
    Meteor.users.update(friendId, {
      $set: {
        "profile.friends": otherFriends,
        "profile.friendRequest": otherRequest,
        "profile.strangers": otherStrangers,
        "profile.recommendedFriends": otherRecommends
      }
    });

    return true;
  },

  "friends/dismissFriend" : function(friendId) {
    if (this.isSimulation) return;

    var user = Meteor.user();
    var friendRecommend = user.profile.recommendedFriends;
    var friendRequest = user.profile.friendRequest;
    var turndownFriends = user.profile.turndownFriends
    if (friendRequest)
      friendRequest = friendRequest.filter(user => user.userId != friendId);
    if (friendRecommend)
      friendRecommend = friendRecommend.filter(user => user.userId != friendId);
    if (turndownFriends) {
      turndownFriends.push({userId: friendId, validThru: moment().add(7, "days").toDate()});
    } else {
      turndownFriends = [{userId: friendId, validThru: moment().add(7, "days").toDate()}];
    }
    Meteor.users.update(this.userId, {
      $set: {
        "profile.friendRequest": friendRequest,
        "profile.turndownFriends": turndownFriends,
        "profile.friendRecommend": friendRecommend
      }
    });

    var friend = Meteor.users.findOne(friendId);
    if (!friend) {
      throw new Meteor.Error("User Not Existed");
      return;
    }
    var otherRecommend = friend.profile.recommendedFriends;
    var otherRequest = friend.profile.friendRequest;
    var otherTurndown = friend.profile.turndownFriends
    if (otherRequest)
      otherRequest = otherRequest.filter(user => user.userId != this.userId);
    if (otherRecommend)
      otherRecommend = otherRecommend.filter(user => user.userId != this.userId);

    if (otherTurndown) {
      otherTurndown.push({userId: this.userId, validThru: moment().add(7, "days").toDate()});
    } else {
      otherTurndown = [{userId: this.userId, validThru: moment().add(7, "days").toDate()}];
    }

    Meteor.users.update(friendId, {
      $set: {
        "profile.friendRequest": otherRequest,
        "profile.turndownFriends": otherTurndown,
        "profile.recommendedFriends": otherRecommend
      }
    });

    return true;
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
