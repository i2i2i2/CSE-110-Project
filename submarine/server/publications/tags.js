// publish tags accociated with wifis
Meteor.publish("tags/tagsUnderWifis", function(wifiList) {

  var bssids = wifiList.map(wifi => wifi.bssid);
  var wifiInDB = App.Collections.Wifis.find({"bssid": {"$in": bssids}},
                                            {"fields": {"tags": 1}}).fetch();

  var tagList = wifiInDB.reduce((wifi1, wifi2) => wifi1.tags.concat(wifi2.tags), []);
  return App.Collections.Tags.find({"_id": {"$in": tagList}},
                                   {"fields": {"users": 0, "activeUser": 0}});
});

// publish users under the tag to user, for user profile picture in chat
Meteor.publish("tags/usersUnderTag", function(tagId) {

  var tag = App.Collections.Tags.findOne({"_id": tagId},
                                      {"fields": {"users": 1, "activeUser": 1}});
  var users = tag.users.concat(tag.activeUser);

  return Meteor.users.find({"_id": {"$in": users}},
                           { "fields": { "profile.profileSeed": 1 }});
});
