// Server-side init scripts
Meteor.startup(function () {

  moment().utc();

  // seeding database
  App.Seeder.Settings();
  App.Seeder.Wifis();
  App.Seeder.Tags();
  App.Seeder.Users();

  // initialized essential Settings
  // App.Initializer.SMTP();
  App.Initializer.configureResetEmail();
});
