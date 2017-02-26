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
  WifiWizard.getCurrentSSID(onSuccess, onErr);
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
 * WifiWizard's onSuccess callback, set wifi config Session
 */
function onSuccess(wifiConfig) {
  var pastConfig = Session.get('wifiConfig');

  if (!pastConfig || pastConfig.bssid != wifiConfig.bssid) {
    Session.set('wifiConfig', wifiConfig);
    console.log("Wifi state change.");
  }

  console.log("Wifi state checked");
}

/**
 * WifiWizard's onErr callback, set error flag
 */
function onErr(err) {
  var error = {err: true, msg: err};
  Session.set('wifiConfig', error);
  console.log('Error getting WiFi config');
}

/**
 * Get nearby wifi, print them to console
 * and return the array including BSSID and level
 * @returns {wifilist}
 */
App.Utils.WifiWizard.getNearbyWifi = function() {
    WifiWizard.getScanResults(onSuccess2, onErr2);
}


/*
 * Handler for getNearbyWifi when successful
 */
function onSuccess2(network) {

  var networkList = network.filter(function(wifi){
    return (wifi.level > -85);
  }).map(function(wifi){
    return{
      bssid: wifi.BSSID,
      ssid: wifi.SSID,
      level: wifi.level
    };
  });


  networkList.push({ssid: "test1", bssid: "11:22:33:44:55:66:77:88", level: -35});
  networkList.push({ssid: "test2", bssid: "22:33:44:55:66:77:88:99", level: -55});
  networkList.push({ssid: "test3", bssid: "33:44:55:66:77:88:99:aa", level: -45});
  networkList.push({ssid: "test4", bssid: "44:55:66:77:88:99:aa:bb", level: -60});
  networkList.push({ssid: "test5", bssid: "55:66:77:88:99:aa:bb:cc", level: -55});
  //console.log(JSON.stringify(networkList, undefined, 2));
  Session.set('wifiList', networkList);
}

/*
 * Handler for getNearbyWifi when failed
 */
function onErr2(network){
  var error = {err: true, msg: err};
  Session.set('wifiList', error);
  console.log("error when trying to scan wifi");
}
