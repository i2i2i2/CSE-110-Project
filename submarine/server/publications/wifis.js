Meteor.publish("wifis/nearbyWifis", function(wifiList) {
  for (var index = 0; index < 5; index++) {
    if (!wifiList[index]) break;

    if (!App.Collections.Wifis.findOne({bssid: wifiList[index].bssid})) {
      App.Collections.Wifis.insert({
        ssid: wifiList[index].ssid,
        bssid: wifiList[index].bssid,
        tags: []
      });
    }
  }

  var wifiIdList = wifiList.map(wifi => wifi.bssid);
  return App.Collections.Wifis.find({bssid: {$in: wifiIdList}});
})
