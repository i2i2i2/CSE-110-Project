// publish user's friends strangers pending request and friend recommendation data
Meteor.publish("users/relatedUsersAndTags", function(userId) {
  var user = Meteor.users.findOne({"_id": userId}, {"profile.friendRequest": 1,
                                                    "profile.recommendedFriends": 1,
                                                    "profile.friends": 1,
                                                    "profile.strangers": 1,
                                                    "profile.savedTags": 1
                                                  });
  // publish user seed and also social media
  var closeUserId = [].concat(user.profile.friendRequest,
                              user.profile.recommendedFriends.map(recommendation => recommendation.userId),
                              user.profile.friends.map(friend => friend.userId));
  // publish only user seed for profile picture
  var strangeUserId = user.profile.strangers;
  // publish chat room description and status
  var tagIds = profile.savedTags.map(tag => tag.tagId);

  return [
    Meteor.users.find({"_id": {"$in": closeUserId}},
                      {
                        "fields": {
                          "username": 1,
                          "emails": 1,
                          "profile.profileSeed": 1,
                          "profile.socialMedia": 1
                        }
                      }),
    Meteor.users.find({"_id": {"$in": closeUserId}},
                      {
                        "fields": {
                          "username": 1,
                          "emails": 1,
                          "profile.profileSeed": 1,
                          "profile.socialMedia": 1
                        }
                      }),
    App.Collections.Tags.find({"_id": {"$in": tagIds}},
                              {
                                "fields": {
                                  "users": 0
                                }
                              })
  ];
});
