App.Collections.Message = new Mongo.Collection('message');

var messageSchema = {
  
  is_public: {
      type: Boolean,
      optional: true
  },
    
  sender: {
      type: String,
      optional: true,
      label: "user id"
  },
  sender_profile:{
      type: String,
      optional: true
  },
  receiver: {
      type: String,
      optional: true
  },
  message:{
      type: String,
      optional: true
  }, 
  time: {
      type: Date,
      optional: true
  },
  rate: {
      type: Number,
      optional: true
  }
};

// attach the schema
App.Schemas.Message = new SimpleSchema(messageSchema);
App.Collections.Message.attachSchema(App.Schemas.Message);
