Template.Debug.events({
  'click .back.button' : function(e, t) {
    FlowRouter.go('/');
  }
})

Template.Debug.helpers({
  "netstat": function() {
    if (Meteor.isCordova) {

      var netstat = Session.get('wifiConfig');
      if (netstat)
        return Spacebars.SafeString("<pre>" + JSON.stringify(netstat, undefined, 2) + "</pre>");
      else
        return Spacebars.SafeString("<pre>Initializing</pre>");

    } else {
      return Spacebars.SafeString("<pre>Only for Cordova</pre>");
    }
  },
  "GPSCoords": function() {
    if (Meteor.isCordova) {
      var coords = Session.get('GPSCoords');
      if (!coords) {
          return Spacebars.SafeString("<pre>Initializing</pre>");
      }

      return Spacebars.SafeString("<pre>" + JSON.stringify(coords, undefined, 2) + "</pre>");

    } else {
      return Spacebars.SafeString("<pre>Only for Cordova</pre>");
    }
  }
})
