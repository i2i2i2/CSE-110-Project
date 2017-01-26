/**
 * Wrapper for cordova geolocation plugin
 * Options: {
 *   maximumAge: maximum times of retrieving gps data (3000)
 *   timeout:    interval to retrieve data (5000ms)
 *   enableHighAccuracy: default to true
 * }
 */
App.Utils.Geolocation.getGPSCoordSession = function(options) {
    navigator.geolocation.getCurrentPosition(onSuccess, onErr, options);
};

/**
 * Wrapper for cordova geolocation plugin watch gps change
 */
App.Utils.Geolocation.updateGPSCoordOnChange = function(options) {
  if ('WatchId' in App.Utils.Geolocation) {
    navigator.geolocation.clearWatch(App.Utils.Geolocation.WatchId);
  }
  App.Utils.Geolocation.WatchId =
      navigator.geolocation.watchPosition(onSuccess, onErr, options);
};

/**
 * stop watching GPS coords
 */
App.Utils.Geolocation.stopWatchGPSChange = function() {
  if ('WatchId' in App.Utils.Geolocation) {
    navigator.geolocation.clearWatch(App.Utils.Geolocation.WatchId);
    delete App.Utils.Geolocation.WatchId;
  }
}

/**
 * Callback on success
 * GPSData: {
 *   coords: coordinate data object, latitude, longitude and etc
 *   timestamp: time getting the data
 * }
 */
function onSuccess(GPSData) {
  Session.set('GPSCoords', GPSData);
  console.log('GPS data get.')
}

/**
 * Callback on failure
 * err: {
 *   code: error code,
 *   message: string describe the error
 * }
 */
function onErr(err) {
  err.err = true;
  Session.set('GPSCoords', err);
  console.log('Error getting GPS data');
}
