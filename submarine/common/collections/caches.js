App.Collections.Caches = new Mongo.Collection('caches');

var cachesSchema = {

  //This is the title of the notificaiton
  title: {
    type: String  ,
    optional: true,
    label: "The title of the message waiting to send to firebase"
  },

  //This is the content of the notification
  content: {
    type: String,
    optional: true,
    label: "The messages waiting to send to firebase"
  },
  //This is the token to identify which user to send the message to
  token: {
    type: String,
    optional: true,
    label: "This is the token which the message which will be sent to."
  },

  priority: {
    type: String,
    optional: true,
    label: "This it the priority of this message"

  }
};

//Attach the schema
App.Schemas.Caches = new SimpleSchema(cachesSchema);
App.Collections.Caches.attachSchema(App.Schemas.Settings);