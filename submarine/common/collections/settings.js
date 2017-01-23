App.Collections.Settings = new Mongo.Collection('settings');

var settingSchema = {
  smtpAddress: {
    type: String,
    optional: false
  },
  smtpPort: {
    type: String,
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
