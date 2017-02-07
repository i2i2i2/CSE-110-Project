// Server-side init scripts
Meteor.startup(function () {

  moment().utc();

  // seeding database
  App.Seeder.Settings();

  // initialized essential Settings
  // App.Initializer.SMTP();
  App.Initializer.configureResetEmail();
});
