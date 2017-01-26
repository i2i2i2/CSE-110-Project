Template.Debug.events({
  'click .back.button' : function(e, t) {
    FlowRouter.go('/');
  }
})

Template.Debug.helpers({
  "netstat": function() {
    if (Meteor.isCordova) {
      var netstat = JSON.stringify(Session.get('wifiConfig'), undefined, 2);
      return Spacebars.SafeString("<pre>" + netstat + "</pre>");

    } else {
      return Spacebars.SafeString("<pre>Only for Cordova</pre>");
    }
  },
  "GPSCoords": function() {
    if (Meteor.isCordova) {
      var GPSCoords = JSON.stringify(Session.get('GPSCoords'), undefined, 2);
      return Spacebars.SafeString("<pre>" + GPSCoords + "</pre>");

    } else {
      return Spacebars.SafeString("<pre>Only for Cordova</pre>");
    }
  }
})
