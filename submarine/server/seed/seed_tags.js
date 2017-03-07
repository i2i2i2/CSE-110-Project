/**
 * Seed tags collection, for dev
 */
App.Seeder.Tags = function() {
  console.log("start tag");
  if (!App.Collections.Tags.findOne({"name": "Earth"})) {
    var test1 = App.Collections.Wifis.findOne({"ssid": "test1"});
    var test2 = App.Collections.Wifis.findOne({"ssid": "test2"});
    var test3 = App.Collections.Wifis.findOne({"ssid": "test5"});

    App.Collections.Tags.insert({
      name: "Earth",
      description: "Channel Earthlings all subscribe to",
      wifis: [{"wifiId": test1._id, "level": -40}, {"wifiId": test2._id, "level": -50}, {"wifiId": test3._id, "level": -55}],
      startTime: 0,
      duration: 1440,
      users: [],
      repeat: 255
    }, (err, res) => {
      if (err) {
        console.log(JSON.stringify(err, undefined, 2));
        return;
      }

      App.Collections.Wifis.update(test1._id, {"$push": {"tags": res}});
      App.Collections.Wifis.update(test2._id, {"$push": {"tags": res}});
      App.Collections.Wifis.update(test3._id, {"$push": {"tags": res}});
    });
  }

  if (!App.Collections.Tags.findOne({"name": "Mars"})) {
    var test4 = App.Collections.Wifis.findOne({"ssid": "test2"});
    var test5 = App.Collections.Wifis.findOne({"ssid": "test3"});
    var test6 = App.Collections.Wifis.findOne({"ssid": "test5"});

    App.Collections.Tags.insert({
      name: "Mars",
      description: "Channel Martians all subscribe to",
      wifis: [{"wifiId": test4._id, "level": -50}, {"wifiId": test5._id, "level": -50}, {"wifiId": test6._id, "level": -55}],
      startTime: 0,
      duration: 1440,
      users: [],
      repeat: 255
    }, (err, res) => {
      if (err) {
        console.log(JSON.stringify(err, undefined, 2));
        return;
      }

      App.Collections.Wifis.update(test4._id, {"$push": {"tags": res}});
      App.Collections.Wifis.update(test5._id, {"$push": {"tags": res}});
      App.Collections.Wifis.update(test6._id, {"$push": {"tags": res}});
    });
  }

  if (!App.Collections.Tags.findOne({"name": "Moon"})) {
    var test7 = App.Collections.Wifis.findOne({"ssid": "test1"});
    var test8 = App.Collections.Wifis.findOne({"ssid": "test3"});
    var test9 = App.Collections.Wifis.findOne({"ssid": "test5"});

    App.Collections.Tags.insert({
      name: "Moon",
      description: "Channel Lunarians all subscribe to",
      wifis: [{"wifiId": test7._id, "level": -40}, {"wifiId": test8._id, "level": -50}, {"wifiId": test9._id, "level": -45}],
      start_time: 0,
      end_time: 1440,
      users: [],
      repeat: 255
    }, (err, res) => {
      if (err) {
        console.log(JSON.stringify(err, undefined, 2));
        return;
      }

      App.Collections.Wifis.update(test7._id, {"$push": {"tags": res}});
      App.Collections.Wifis.update(test8._id, {"$push": {"tags": res}});
      App.Collections.Wifis.update(test9._id, {"$push": {"tags": res}});
    });
  }
};
