Meteor.methods({
  'tags/createTag': function(tagData,wifiArray) {
    // research isSimulation
    if (this.isSimulation) return;

    var doc = App.Collections.Tags.findOne({name: tagData.name});
    if (doc && doc.name) {
      console.log("Tag Name already exists");
      throw new Meteor.Error("Error in creating", "Tag Name already exists");
    }

    var tagId = App.Collections.Tags.insert(tagData);

    wifiArray.forEach(function(wifi) {
      var wifiInDb = App.Collections.Wifis.findOne({bssid: wifi.bssid});
      if (wifiInDb) {
        wifi.id = wifiInDb._id;
        App.Collections.Wifis.update(wifi.id, {"$push": {"tags": tagId}});
      } else {
        wifi.id = App.Collections.Wifis.insert({
          bssid: wifi.bssid,
          ssid: wifi.ssid,
          tags : [tagId]
        });
      }
    });

    var wifiInTag = wifiArray.map((wifi) => {
      return {
        wifiId: wifi.bssid,
        level: wifi.level
      };
    });
    App.Collections.Tags.update(tagId, {$set: {wifis: wifiInTag}});
    return tagId;
  },

  "tags/getTagsById": function(tagIds) {
    return App.Collections.Tags.find({_id: {$in: tagIds}}).fetch();
  },

  "tags/addActiveUser": function(tagId) {
    if (this.isSimulation) return;
    var tag = App.Collections.Tags.findOne(tagId);
    if (!tag) return;
    var activeUser = tag.activeUser? tag.activeUser.concat([this.userId]): [this.userId];
    App.Collections.Tags.update(tagId, {
      "$set": {
        "activeUser": activeUser
      }
    });
  },

  "tags/subscribe": function(tagId) {
    if (this.isSimulation) return;
    var tag = App.Collections.Tags.findOne(tagId);
    var users = tag.users? tag.users.concat([this.userId]) : [this.userId];
    var activeUser = tag.activeUser? tag.activeUser.filter(id => id != this.userId): [];

    App.Collections.Tags.update(tagId, {
      "$set": {
        "users": users,
        "activeUser": activeUser
      }
    });

    var savedTag = {
      tagId: tagId,
      validThru: moment().add(7, "days").toDate(),
      calendar: false
    }
    Meteor.users.update(this.userId, {
      "$push": {
        "profile.savedTags": savedTag
      }
    });
  },

  "tags/unsubscribe": function(tagId) {
    if (this.isSimulation) return;
    var tag = App.Collections.Tags.findOne(tagId);
    var users = tag.users? tag.users.filter(id => id != this.userId) : [];
    var activeUser = tag.activeUser? tag.activeUser.concat([this.userId]): [this.userId];

    App.Collections.Tags.update(tagId, {
      "$set": {
        "users": users,
        "activeUser": activeUser
      }
    });

    var savedTags = Meteor.user().profile.savedTags.filter(tag => tag.tagId != tagId);
    Meteor.users.update(this.userId, {
      "$set": {
        "profile.savedTags": savedTags
      }
    });
  }
})
