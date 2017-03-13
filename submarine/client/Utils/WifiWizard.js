//A list of wifi which can be scanned by the mobile device

/**
 * Wrap wifi wifizard functions to App.Utils.WifiWizard
 * Get user's current wifi ssid and bssid
 */
App.Utils.WifiWizard.getWifiConfigSession = function() {
  WifiWizard.getCurrentSSID(onSuccess, onErr);
};

/**
 * watch wifi change, update session only if wifi config change
 * @param watch time interval in milliseconds.
 */
App.Utils.WifiWizard.updateWifiConfigOnChange = function(interval) {
  if ('WatchId' in App.Utils.WifiWizard) {
    clearInterval(App.Utils.WifiWizard.watchId);
  }

  WifiWizard.getCurrentSSID(function (wifiConfig) {
    var pastConfig = Session.get('wifiConfig');

    if (!pastConfig || pastConfig.bssid != wifiConfig.bssid) {
      Session.set('wifiConfig', wifiConfig);
    }
  }, function (err) {
    var error = {err: true, msg: err};
    Session.set('wifiConfig', error);
  });

  App.Utils.WifiWizard.watchId =
      setInterval(App.Utils.WifiWizard.getWifiConfigSession, interval);
};

/**
 * stop watch wifi change
 */
App.Utils.WifiWizard.stopWatchWifiChange = function() {
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
      var network = res;
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

      console.log(JSON.stringify(networkList.slice(0, 4), undefined, 2));
      Session.set('wifiList', networkList);
      callback(networkList);

    }, function (err){
      var error = {err: true, msg: err};
      Session.set('wifiList', error);
      console.log("error when trying to scan wifi");
    });
  } else {
    WifiWizard.getScanResults(function (network) {

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


      console.log(JSON.stringify(networkList.slice(0, 4), undefined, 2));
      Session.set('wifiList', networkList);
      return networkList;
    }, function (err){
      var error = {err: true, msg: err};
      Session.set('wifiList', error);
      console.log("error when trying to scan wifi");
    });
  }
}
