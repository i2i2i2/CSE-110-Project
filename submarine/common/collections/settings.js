App.Collections.Settings = new Mongo.Collection('settings');

var settingSchema = {
  smtpAddress: {
    type: String,
    optional: false
  },
  smtpPort: {
    type: Number,
    optional: false
  },
  smtpUsername: {
    type: String,
    optional: false
  },
  smtpPassword: {
    type: String,
    optional: false
  },
  smtpAuthentication: {
    type: String,
    optional: false
  }
}

// attach the schema
App.Schemas.Setting = new  SimpleSchema(settingSchema);
App.Collections.Settings.attachSchema(App.Schemas.Settings);
