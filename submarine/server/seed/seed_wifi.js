/**
 * Seed wifis collection, for dev
 */
App.Seeder.Wifis = function() {

  if (!App.Collections.Wifis.findOne({ssid: "test1"})) {
    App.Collections.Wifis.insert({
      ssid: "test1",
      bssid: "11:22:33:44:55:66:77:88",
      tags: []
    });
  }

  if (!App.Collections.Wifis.findOne({ssid: "test2"})) {
    App.Collections.Wifis.insert({
      ssid: "test2",
      bssid: "22:33:44:55:66:77:88:99",
      tags: []
    });
  }

  if (!App.Collections.Wifis.findOne({ssid: "test3"})) {
    App.Collections.Wifis.insert({
      ssid: "test3",
      bssid: "33:44:55:66:77:88:99:aa",
      tags: []
    });
  }

  if (!App.Collections.Wifis.findOne({ssid: "test4"})) {
    App.Collections.Wifis.insert({
      ssid: "test4",
      bssid: "44:55:66:77:88:99:aa:bb",
      tags: []
    });
  }

  if (!App.Collections.Wifis.findOne({ssid: "test5"})) {
    App.Collections.Wifis.insert({
      ssid: "test5",
      bssid: "55:66:77:88:99:aa:bb:cc",
      tags: []
    });
  }

  console.log("end wifi")
};
