//A list of wifi which can be scanned by the mobile device

/**
 * Wrap wifi wifizard functions to App.Utils.WifiWizard
 * Get user's current wifi ssid and bssid
 */
App.Utils.WifiWizard.startScan = function() {
  WifiWizard.startScan(function() {
    console.log("Scan Started");
  }, function() {
    console.log("Scan Failed");
  })
};

/**
 * watch wifi change, update session only if wifi config change
 * @param watch time interval in milliseconds.
 */
App.Utils.WifiWizard.scanWifiOnInterval = function(interval) {
  if ('WatchId' in App.Utils.WifiWizard) {
    clearInterval(App.Utils.WifiWizard.watchId);
  }

  App.Utils.WifiWizard.watchId =
      setInterval(App.Utils.WifiWizard.startScan, interval);
};

/**
 * stop watch wifi change
 */
App.Utils.WifiWizard.stopScanWifi = function() {
  if ('WatchId' in App.Utils.WifiWizard) {
    clearInterval(App.Utils.WifiWizard.watchId);
    delete App.Utils.WifiWizard.WatchId;
  }
};

/**
 * Get nearby wifi, print them to console
 * and return the array including BSSID and level
 * @returns {wifilist}
 */
App.Utils.WifiWizard.getNearbyWifi = function(callback) {
  if (callback) {
    WifiWizard.getScanResults(function (res) {
      console.log(JSON.stringify(res[0], undefined, 2));

      var repeatIndex = 0;
      var networkList = res.sort(function(wifi1, wifi2) {
        return wifi1.bssid > wifi2.bssid? 1 : -1;
      }).slice(0, res.length);

      networkList = networkList.filter(function(wifi, index, wifiList) {
        var repeat = false;
        if (index > repeatIndex) {
          if (wifi.BSSID.substr(0, 14) == wifiList[repeatIndex].BSSID.substr(0, 14)) {
            repeat = true;
          }
          repeatIndex = index;
        }

        return !repeat && (wifi.level > -85);

      })

      networkList = networkList.map(function(wifi){
        return{
          bssid: wifi.BSSID,
          ssid: wifi.SSID,
          level: wifi.level
        };
      })

      networkList = networkList.sort(function(wifi1, wifi2) {
        return wifi2.level - wifi2.level;
      });

      console.log("wifiList get  " + Date.now());
      console.log(JSON.stringify(networkList[0], undefined, 2));
      Session.set('wifiList', networkList);
      callback(networkList);

    }, function (err){
      var error = {err: true, msg: err};
      Session.set('wifiList', error);
      console.log("error when trying to scan wifi");
    });
  } else {
    WifiWizard.getScanResults(function (network) {
      console.log(JSON.stringify(network[0], undefined, 2));

      var repeatIndex = 0;
      var networkList = network.sort(function(wifi1, wifi2) {
        return wifi1.bssid > wifi2.bssid? 1 : -1;

      }).filter(function(wifi, index, wifiList){
        var repeat = false;
        if (index > repeatIndex) {
          if (wifi.BSSID.substr(0, 14) == wifiList[repeatIndex].BSSID.substr(0, 14)) {
            repeat = true;
          }
          repeatIndex = index;
        }

        return !repeat && (wifi.level > -85);

      }).map(function(wifi){
        return{
          bssid: wifi.BSSID,
          ssid: wifi.SSID,
          level: wifi.level
        };
      }).sort(function(wifi1, wifi2) {
        return wifi2.level - wifi2.level;
      });


      console.log("wifiList get  " + Date.now());
      Session.set('wifiList', networkList);
      return networkList;
    }, function (err){
      var error = {err: true, msg: err};
      Session.set('wifiList', error);
      console.log("error when trying to scan wifi");
    });
  }
}
