/**
 * Wrap wifi wifizard functions to App.Utils.WifiWizard
 * Get user's current wifi ssid and bssid
 */
App.Utils.WifiWizard.getWifiConfigSession = function() {
  WifiWizard.getCurrentSSID(onSuccess, onErr);
}

/**
 * watch wifi change, update session only if wifi config change
 * @param watch time interval in milliseconds.
 */
App.Utils.WifiWizard.updateWifiConfigOnChange = function(interval) {
  if ('WatchId' in App.Utils.WifiWizard) {
    clearInterval(App.Utils.WifiWizard.watchId);
  }
  App.Utils.WifiWizard.watchId =
      setInterval(App.Utils.WifiWizard.getWifiConfigSession, inverval);
}

/**
 * stop watch wifi change
 */
App.Utils.WifiWizard.stopWatchWifiChange = function() {
  if ('WatchId' in App.Utils.WifiWizard) {
    clearInterval(App.Utils.WifiWizard.watchId);
    delete App.Utils.WifiWizard.WatchId;
  }
}

/**
 * WifiWizard's onSuccess callback, set wifi config Session
 */
function onSuccess(wifiConfig) {
  var config = Session.get('wifiConfig');
  if (!wifiConfig || wifiConfig.bssid != config.bssid)
    Session.set('wifiConfig', wifiConfig);
}

/**
 * WifiWizard's onErr callback, set error flag
 */
function onErr(err) {
  var error = {err: true, msg: err};
  Session.set('wifiConfig', error);
}
