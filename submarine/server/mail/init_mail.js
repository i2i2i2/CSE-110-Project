/**
 * Initialize external smtp setting, sending site email
 */
App.Initializer.SMTP = function () {

  var settings = App.Collections.Settings.findOne();
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(settings.smtpUsername)
    + ':' + encodeURIComponent(settings.smtpPassword)
    + '@' + encodeURIComponent(settings.smtpAddress)
    + ':' + settings.smtpPort;
};
