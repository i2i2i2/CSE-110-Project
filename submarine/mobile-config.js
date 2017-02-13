App.setPreference('android-targetSdkVersion', '22');

//Disable orientation in mobile device during using the app
App.setPreference("orientation", "portrait");

//Define the name of application in mobile device
App.info({
    name: 'Submarine'
});
// mobile-config.js
App.icons({
    iphone_2x: 'resources/icons/iphone_2x.png',
    iphone_3x: 'resources/icons/iphone_3x.png',
    ipad: 'resources/icons/ipad.png',
    ipad_2x: 'resources/icons/ipad_2x.png',
    ipad_pro: 'resources/icons/ipad_pro.png',
    ios_settings: 'resources/icons/ios_settings.png',
    ios_settings_2x: 'resources/icons/ios_settings_2x.png',
    ios_settings_3x: 'resources/icons/ios_settings_3x.png',
    ios_spotlight: 'resources/icons/ios_spotlight.png',
    ios_spotlight_2x: 'resources/icons/ios_spotlight_2x.png',
    android_mdpi: 'resources/icons/android_mdpi.png',
    android_hdpi: 'resources/icons/android_hdpi.png',
    android_xhdpi: 'resources/icons/android_xhdpi.png',
    android_xxhdpi: 'resources/icons/android_xxhdpi.png',
    android_xxxhdpi: 'resources/icons/android_xxxhdpi.png',
});