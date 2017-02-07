/**
 * Wrapper for Cordova plug-in: schedule a single Notification
 * @param:
 *      message: the main message to be displayed as Notification
 * Desired outcome: Displaying a single message
 * by default: "Yellow Submarine" would be displayed as title
 */

App.Utils.Notification.scheduleSingleNotification = function(message){
    cordova.plugins.notification.local.schedule({
        id: 1,
        title: "Yellow Submarine",
        text: message
    });
};
