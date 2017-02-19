App.Collections.Wifis = new Mongo.Collection('wifis');

var wifiSchema = {

  ssid: {
    type: String,
    optional: true
  },
  bssid: {
    type: String,
    optional: true
  },
  tags: {
    type: Array,
    optional: true,
    label: "array of ids of active_tags that are under this wifi"
  },
  "tags.$": {
    type: String,
    optional: true
  }
};

// attach the schema
App.Schemas.Wifis = new SimpleSchema(wifiSchema);
App.Collections.Wifis.attachSchema(App.Schemas.Wifis);