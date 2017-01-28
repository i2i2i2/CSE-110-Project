/**
 * Wrapper for cordova geolocation plugin
 * Options: {
 *   maximumAge: maximum times of retrieving gps data (3000)
 *   timeout:    interval to retrieve data (5000ms)
 *   enableHighAccuracy: default to true
 * }
 */
App.Utils.Geolocation.getGPSCoordSession = function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onErr);
};

/**
 * Wrapper for cordova geolocation plugin watch gps change
 */
App.Utils.Geolocation.updateGPSCoordOnChange = function(interval) {
  if ('WatchId' in App.Utils.Geolocation) {
    clearInterval(App.Utils.Geolocation.WatchId);
  }
  navigator.geolocation.getCurrentPosition(onSuccess, onErr);
  App.Utils.Geolocation.WatchId =
      setInterval(App.Utils.Geolocation.getGPSCoordSession, interval);
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
  var GPS = {
    latitude: GPSData.coords.latitude,
    longitude: GPSData.coords.longitude,
    accuracy: GPSData.coords.accuracy
  };
  var prevGPS = Session.get('GPSCoords');
  if (!prevGPS || prevGPS.latitude != GPS.latitude || prevGPS.longitude != GPS.longitude) {
    Session.set('GPSCoords', GPS);
    console.log('GPS location changed.');
  }
  console.log('GPS data get.');
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
