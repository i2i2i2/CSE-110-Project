App.Schemas.UserProfile = new SimpleSchema({
  profileSeed: {
    type: String,
    optional: true,
    label: "random seed that generates the profile picture"
  }
})

App.Schemas.User = new SimpleSchema({
  username: {
    type: String,
    optional: true
  },
  emails: {
    type: Array,
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: App.Schemas.UserProfile,
    optional: true,
    label: "user's profile, only field to auto publish to Client"
  }
});

// Meteor has its own user data base, only need to attach the Schemas
Meteor.users.attachSchema(App.Schemas.User);
