App.Schemas.UserProfile = new SimpleSchema({
  profileSeed: {
    type: String,
    optional: true,
    label: "random seed that generates the profile picture"
  },

  friendRequest: {
    type: Array,
    optional: true,
    label: "Array of users who send friend request to this user, include userId, requestReason"
  },

  "friendRequest.$": {
    type: Object,
    optional: true
  },
    
  "friendRequest.$.userId": {
    type: String,
    optional: true
  },

  "friendRequest.$.requestReason": {
    type: String,
    optional: true,
    label: "Why want to add friends"
  },

  recommendedFriends: {
    type: Array,
    optional: true,
    label: "Array of recommendedFriends to user, include userId, user name, profile seed"
  },

  "recommendedFriends.$": {
    type: Object,
    optional: true
  },

  "recommendedFriends.$.userId": {
    type: String,
    optional: true
  },

  "recommendedFriends.$.recommendReason": {
    type: String,
    optional: true,
    label: "String of common chatroom of 2 users"
  },

  turndownFriends: {
    type: Array,
    optional: true,
    label: "array of turn down friend request, future request will be blocked to some time"
  },

  "turndownFriends.$": {
    type: Object,
    optional: true
  },

  "turndownFriends.$.userId": {
    type: String,
    optional: true
  },

  "turndownFriends.$.validThru": {
    type: Date,
    optional: true
  },

  friends: {
    type: Array,
    optional: true
  },

  "friends.$": {
    type: Object,
    optional: true
  },

  "friends.$.userId": {
    type: String,
    optional: true
  },

  "friends.$.nickname": {
    type: String,
    optional: true
  },

  strangers: {
    type: Array,
    optional: true,
    label: "Stranger that chats with user auto remove in certain time"
  },

  "strangers.$": {
    type: Object,
    optional: true
  },

  "strangers.$.userId": {
    type: String,
    optional: true
  },

  "strangers.$.validThru": {
    type: Date,
    optional: true
  },

  savedTags: {
    type: Array,
    optional: true,
    label: "user saved tag, can be accessed any time"
  },

  "savedTags.$": {
    type: Object,
    optional: true
  },

  "savedTags.$.tagId": {
    type: String,
    optional: true
  },

  "savedTags.$.validThru": {
    type: Date,
    optional: true
  },

  socialMedia: {
    type: Object,
    optional: true,
    label: "store user social media info"
  },

  "socialMedia.facebook": {
    type: String,
    optional: true
  },

  "socialMedia.google": {
    type: String,
    optional: true
  },

  "socialMedia.github": {
    type: String,
    optional: true
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
  },

  allowBeRecommended: {
    type: Boolean,
    optional: false,
    label: "if user want to be recommaned to others as friends"
  },

  recentTags: {
    type: Array,
    optional: true,
    label: "user saved tag, can be accessed any time"
  },

  "recentTags.$": {
    type: Object,
    optional: true
  },

  "recentTags.$.tagId": {
    type: String,
    optional: true
  },

  "recentTags.$.time": {
    type: Date,
    optional: true
  },

  login_history : {
    type: Array,
    optional: true
  },

  "login_history.$": {
    type: Date,
    optional: true
  },

  token: {
    type: String,
    optional: true,
    label: "user's android device token"
  },

  online : {
    type: Boolean,
    optional: true,
    label: "If the user is currently running the application"
  }

});

// Meteor has its own user data base, only need to attach the Schemas
Meteor.users.attachSchema(App.Schemas.User);
