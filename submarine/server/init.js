// Server-side init scripts
Meteor.startup(function () {

  process.env.ROOT_URL = 'http://100.81.53.102:3000/';
  process.env.MOBILE_ROOT_URL = 'http://100.81.53.102:3000/';
  process.env.MOBILE_DDP_URL = 'http://100.81.53.102:3000/';

  // seeding database
  App.Seeder.Settings();
  App.Seeder.Wifis();
  App.Seeder.Tags();
  App.Seeder.Users();

  // initialized essential Settings
  // App.Initializer.SMTP();
  App.Initializer.configureResetEmail();
});
