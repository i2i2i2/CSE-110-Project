//A list of wifi which can be scanned by the mobile device
//Only includes BSSID and level
var wifiList = [];

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
    return wifiList;
}


/*
 * Handler for getNearbyWifi when successful
 */
function onSuccess2(network) {
  var i;

  //Print to console for five
  for(i = 0; i < 5; i++){
    console.log("SSID: " + JSON.stringify(network[i].SSID) + " BSSID: " + JSON.stringify(network[i].BSSID) +
        " Level: " + JSON.stringify(network[i].level));
  }
  console.log("Check var wifilist for complete list!");

  //Store all scanned wifi to a list
  for(i = 0; i < network.length; i++)
  {
    wifiList.push({
      BSSID: JSON.stringify(network[i].BSSID),
        level: JSON.stringify(network[i].level)
    });
  }
}

/*
 * Handler for getNearbyWifi when failed
 */
function onErr2(network){
  var error = {err: true, msg: err};
  Session.set('wifiConfig', error);
  console.log("error when trying to scan wifi");
}
