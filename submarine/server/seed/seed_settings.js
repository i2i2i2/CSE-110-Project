/**
 * Seed settings collection, if settings collection is found empty
 */
App.Seeder.Settings = function() {

  if (App.Collections.Settings.find().count() == 0) {

    var smtpSettings = {
      smtpAddress: "smtp.gmail.com",
      smtpPort: 465,
      smtpUsername: "noreply.submarine.cse110@gmail.com",
      smtpPassword: "asdfqwer",
      smtpAuthentication: "tls/ssl"
    };

    //App.Collections.Settings.insert(smtpSettings);
  }
};
