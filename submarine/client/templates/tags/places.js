Template.Places.onRendered(function() {
	var self = this;
  Session.set("currentTemplate", "places");
});


Template.Places.helpers({
	"emptyTag": function() {
		if(Meteor.user().profile.savedTags == null || Meteor.user().profile.savedTags.length === 0) {
			return true;
  	}
	},

//	"incomingTags": () => {
//    if (!Meteor.userId()) return;

//	}

  "recentTags": () => {
    if (!Meteor.userId()) return;

    var latestMsg = Session.get("latestMsg");
    var tags = Meteor.user().profile.savedTags.slice();

    if (!latestMsg) return tags;

    tags = tags.map((tag) => {
      var tag = App.Collections.Tags.findOne(tag.tagId);
      tag.latestMsg = latestMsg[tag.tagId];
      tag.lastRead = localStorage.getItem(tag.tagId);
      return tag;

    }).sort(function(tag1, tag2) {
      if (tag1.latestMsg) {
        if (tag2.latestMsg) {
          return -tag1.latestMsg.time.getTime() + tag2.latestMsg.time.getTime();
        } else {
          return -tag1.latestMsg.time.getTime();
        }
      } else {
        if (tag2.latestMsg) {
          return tag2.latestMsg.time.getTime();
        } else {           
        	return 0;
        }
      }
    });

    console.log(tags);
    return tags;
  },

  unreadMessage: (target) => {
    var lastRead;
    if (target.userId) {
      lastRead = localStorage.getItem(target.userId);
    } else if (target.tagId) {
      lastRead = localStorage.getItem(target.tagId);
    }
  
    if (lastRead && target.latestMsg) {
      return (new Date(lastRead)).getTime() < target.latestMsg.time.getTime();
    } else {
      return false;
    }
  },

  "getRepetition": function(tag) {
       if (tag.repeat == 127) return "All Days";
       if (tag.repeat == 65) return "Weekends";
       if (tag.repeat == 62) return "Weekdays";

       var weekday = ["S ", "M ", "T ", "W ", "Th ", "F ", "S"];
       var repeat = tag.repeat.toString(2);
       var paddingL = 7 - repeat.length;
       for (var index = 0; index < paddingL; index++) {
         repeat = "0" + repeat;
       }

       var repeatStr = "";
       for (var index = 0; index < 7; index++) {
         if (repeat.charAt(index) == "1") {
           repeatStr += weekday[index];
         }
       }
       return repeatStr;
     },
  "getDuration": function(tag) {
       var start, end;
       if (tag.duration == 1440) {
         var start = "00:00";
         var end = "24:00";
       } else {
         var start = moment("1970-01-01").add(tag.startTime, "minutes").format("HH:mm");
         var end = moment("1970-01-01").add(tag.startTime + tag.duration, "minutes").format("HH:mm");
       }
       return start + " - " + end;
  },

})
  Template.Places.events({
   "click .tag_avatar": function (e, t) {
    var idNumber = t.$(e.currentTarget).data('tagId');

    FlowRouter.go('/chats/tag/'+idNumber);
    },
  });