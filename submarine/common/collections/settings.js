App.Collections.Settings = new Mongo.Collection('settings');

var settingSchema = {
  smtpAddress: {
    type: String,
    optional: true
  },
  smtpPort: {
    type: String,
    optional: true
  },
  smtpUsername: {
    type: String,
    optional: true
  },
  smtpPassword: {
    type: String,
    optional: true
  },
  smtpAuthentication: {
    type: String,
    optional: true
  }
}

// attach the schema
App.Schemas.Setting = new SimpleSchema(settingSchema);
App.Collections.Settings.attachSchema(App.Schemas.Settings);
