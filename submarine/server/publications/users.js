// publish user's friends strangers pending request and friend recommendation data
Meteor.publish("users/relatedUsersAndTags", function() {
  if (!this.userId)
    return this.ready();

  //Update this in the collection
  Meteor.users.update(this.userId, { $set: {"online": true} });

  var user = Meteor.users.findOne({"_id": this.userId}, {"profile.profileSeed": 1,
                                                    "profile.friendRequest": 1,
                                                    "profile.recommendedFriends": 1,
                                                    "profile.friends": 1,
                                                    "profile.strangers": 1,
                                                    "profile.savedTags": 1,
                                                    "profile.socialMedia": 1
                                                  });
  // publish user seed and also social media
  var userIds = [].concat(user.profile.profileSeed, user.profile.friendRequest.map(requests => requests.userId), user.profile.socialMedia,
                          user.profile.recommendedFriends.map(recommendation => recommendation.userId),
                          user.profile.friends.map(friend => friend.userId));

  // publish chat room description and status
  var tagIds = user.profile.savedTags.map(tag => tag.tagId);

  //Detect that the user exit the application
  var self = this;
  this.onStop(function() {
    Meteor.users.update(self.userId,
      { "$set": {"online": false} });
  });

  return [
    Meteor.users.find({"_id": {"$in": userIds}},
                      {
                        "fields": {
                          "profile.profileSeed": 1,
                          "username": 1,
                          "emails": 1,
                          "profile.socialMedia": 1,
                          "profile.savedTags": 1
                        }
                      }),
    App.Collections.Tags.find({"_id": {"$in": tagIds}})
  ];
});

// publish stranger user info only the profile seed for profile picture.
Meteor.publish("users/strangersInfo", function(strangers) {
  if (!this.userId)
    return this.ready();

  return Meteor.users.find({"_id": {"$in": strangers}},
                           {
                             "fields": {
                               "profile.profileSeed": 1,
                               "profile.savedTags": 1
                             }
                           });
});

// publish only one stranger info
Meteor.publish("users/getStrangerProfile", function(strangerId) {
  return Meteor.users.find(strangerId, {
    "fields": {
      "profile.profileSeed": 1,
      "profile.savedTags": 1
    }
  });
});

Meteor.publish("users/getSingleTag", function(tagId) {
  var tag = App.Collections.Tags.findOne(tagId);
  if (tag) {
    var users = tag.users;
    return [App.Collections.find(tagId),
            Meteor.users.find({
              "_id": { "$in": users }
            }, {
              "fields": {
                "profile.profileSeed": 1
              }
            })];
  }
});

Meteor.publish("users/profilePicUnderTag", function(tagId) {
  var tag = App.Collections.Tags.findOne(tagId);
  if (tag) {
    var users = tag.users;
    return Meteor.users.find({
              "_id": { "$in": users }
            }, {
              "fields": {
                "profile.profileSeed": 1
              }
            });
  }
})
