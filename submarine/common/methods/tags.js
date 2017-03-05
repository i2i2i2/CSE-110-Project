Meteor.methods({
  'tags/createTag': function(tagData,wifiArray) {
  // research isSimulation
  if (this.isSimulation) return;
  
  var doc = App.Collections.Tags.findOne({name: tagData.name});
  if (doc && doc.name) {
    console.log("Tag Name already exists");
    throw new Meteor.Error("Error in creating", "Tag Name already exists");
  }
  
  var id = App.Collections.Tags.insert(tagData);

  for (var item in wifiArray){
    if (App.Collections.Wifis.findOne({bssid: item.bssid})) {
      App.Collections.Wifis.update({bssid: item.bssid}, {"$push": {"tags": id}});
    } else {
      App.Collections.Wifis.insert({
        bssid: item.bssid, 
        ssid: item.ssid,
        tags : [tagData.name]
      });
    }

  }
}
})
