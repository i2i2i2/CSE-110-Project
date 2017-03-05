Meteor.methods({
  'tags/createTag': function(tagData,wifiArray) {
  // research isSimulation
  if (this.isSimulation) return;

  //App.Collections.Tags.insert(tagData);

  for (var item in wifiArray){
    if (App.Collections.Wifis.findOne({bssid: item.bssid})) {
      App.Collections.Wifis.update({bssid: item.bssid}, {"$push": {"tags": res}});
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
