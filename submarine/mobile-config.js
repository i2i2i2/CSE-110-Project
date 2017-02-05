App.setPreference('android-targetSdkVersion', '22');

//Disable orientation in mobile device during using the app
App.setPreference("orientation", "portrait");

//Define the name of application in mobile device
App.info({
    name: 'Submarine'
});
