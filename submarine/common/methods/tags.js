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
        wifiId: wifi.id,
        level: wifi.level
      };
    });
    App.Collections.Tags.update(tagId, {$set: {wifis: wifiInTag}});

    return tagId;
  },

  "tags/getTagsById": function(tagIds) {
    return App.Collections.Tags.find({_id: {$in: tagIds}}).fetch();
  }
})
