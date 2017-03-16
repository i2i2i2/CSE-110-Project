Template.TagProfile.onCreated(function() {
  var self = this;
  self.tag = new ReactiveVar(false);
  self.repeat = new ReactiveVar(0);
  self.isSubbed = new ReactiveVar(false);

  self.autorun(function() {
    FlowRouter.watchPathChange();
    self.tagId = FlowRouter.current().params._id;
    var userTags = Meteor.user().profile.savedTags;
    var isSubbed;
    if (userTags) {
      isSubbed = userTags.find(tag => tag.tagId == self.tagId)? true: false;
    } else {
      isSubbed = false;
    }

    self.isSubbed.set(isSubbed)

    if (!isSubbed) {
      // user profile picture included
      self.subscribe("users/getSingleTag", self.tagId, function() {
        var tag = App.Collections.Tags.findOne(self.tagId);
        self.tag.set(tag);
        self.repeat.set(tag.repeat);
      });

    } else {
      var tag = App.Collections.Tags.findOne(self.tagId);
      self.tag.set(tag);
      self.repeat.set(tag.repeat);

      // get user profile_picture
      self.subscribe("users/profilePicUnderTag", self.tagId);
    }
  });

  $(".bottom.nav").addClass("hidden");

  self.displaySpan = function(parent, msg, isErr) {
    console.log(msg);
    parent.append('<div class="' + (isErr ? "error" : "pass") + '">'
                  + (isErr ? '<i class="fa fa-minus-circle"></i>' : '<i class="fa fa-check-circle"></i>')
                  + msg + '</div>');
    var span;
    if (isErr)
      span = parent.find(".error");
    else
      span = parent.find(".pass");

    span.fadeOut(400).fadeIn(400).fadeOut(400);
    setTimeout(function() {
      span.remove();
    }, 1200);
  }
});

Template.TagProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
});

Template.TagProfile.helpers({
  randomSeed: function() {
    FlowRouter.watchPathChange();
    return FlowRouter.current().params._id;
  },
  getTagName: function() {
    var tag = Template.instance().tag.get();
    return tag? tag.name: "";
  },
  isSubbed: () => Template.instance().isSubbed.get(),
  getDuration: () => {
    var tag = Template.instance().tag.get();
    if (!tag) return;
    if (tag.duration == 1440) {
      var start = "00:00";
      var end = "24:00";
    } else {
      var start = moment("1970-01-01").add(tag.startTime, "minutes").format("HH:mm");
      var end = moment("1970-01-01").add(tag.startTime + tag.duration, "minutes").format("HH:mm");
    }
    return start + " - " + end;
  },
  getRepetition: function() {
    var tag = Template.instance().tag.get();
    if (!tag) return;
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
  getSubNumber: function() {
    var tag = Template.instance().tag.get();
    if (!tag) return 0;
    if (!tag.users) return 0;
    if (!tag.users.length) return 0;
    return tag.users.length;
  },
  members: function() {
    var tag = Template.instance().tag.get();
    if (!tag) return false;
    return tag.users;
  },
  profileSeed: function(id) {
    var user = Meteor.users.findOne(id);
    return user? user.profile.profileSeed: "";
  },
  getDescription: function() {
    var tag = Template.instance().tag.get();
    if (!tag) return false;
    return tag.description;
  },
  isOnTime: function() {
    var mmt = moment();
    var mmtMidnight = mmt.clone().startOf('day');
    var diff = mmt.diff(mmtMidnight, 'minutes');
    var tag = Template.instance().tag.get();
    if (!tag) return;

    var day = 7 - (new Date()).getDay();
    var repeat = tag.repeat.toString(2);
    if (repeat.length < day || repeat.charAt(repeat.length - day) == "0")
      return false;

    var start = tag.startTime;
    var end = (tag.startTime + tag.duration) % 1440;
    var isOnTime;
    if (end <= start) {
      isOnTime = diff > start || diff < end;
    } else {
      isOnTime = diff > start && diff < end;
    }
    Template.instance().isOnTime = isOnTime;
    return isOnTime;
  },
  isInRange: function() {
    var tag = Template.instance().tag.get();
    if (!tag) return false;
    var tagList = Session.get("nearbyTags");
    if ((typeof tagList) != (typeof [])) return false;
    var found = tagList.find(tagtag => tagtag._id == tag._id);
    Template.instance().isInRange = found? true: false;
    return Template.instance().isInRange;
  },
  exist: function() {
    var tag = Template.instance().tag.get();
    return tag? true: false;
  },
  isCheck: function(day) {
    var repeat = Template.instance().repeat.get();
    repeat = repeat.toString(2);
    if (repeat.length < 7 - day || repeat.charAt(repeat.length - 7 + day) == '0') {
      return "";
    } else {
      return "select";
    }
  }
})

Template.TagProfile.events({
  "click .addFriend.button": function(e, t) {
    console.log(t.tagId);
    console.log(t.isSubbed.get());
    console.log(t.isOnTime && t.isInRange);
    if (!t.isSubbed.get() && !(t.isOnTime && t.isInRange))
      return;

    if ($(e.currentTarget).hasClass("green")) {
      clearTimeout(t.dblclickTimeout);
      Meteor.call("tags/subscribe", t.tagId, (err, res) => {
        $(e.currentTarget).removeClass("green");
        t.isSubbed.set(true);
      });
      $(e.currentTarget).html('<i class="fa fa-refresh fa-spin"></i>Subbing...');

    } else if ($(e.currentTarget).hasClass("red")) {
      clearTimeout(t.dblclickTimeout);
      Meteor.call("tags/unsubscribe", t.tagId, (err, res) => {
        $(e.currentTarget).removeClass("red");
        t.isSubbed.set(false);
      });
      $(e.currentTarget).html('<i class="fa fa-refresh fa-spin"></i>UnSubbing...');

    } else {
      if (t.isSubbed.get()) {
        $(e.currentTarget).addClass("red");
        $(e.currentTarget).html('<i class="fa fa-chain-broken"></i>Sure?');

        t.dblclickTimeout = setTimeout(function() {
          $(e.currentTarget).removeClass("red");
          $(e.currentTarget).html('<i class="fa fa-chain-broken"></i>unsubscribe');
        }, 2000);
      } else {
        $(e.currentTarget).addClass("green");
        $(e.currentTarget).html('<i class="fa fa-chain-broken"></i>Sure?');

        t.dblclickTimeout = setTimeout(function() {
          $(e.currentTarget).removeClass("red");
          $(e.currentTarget).html('<i class="fa fa-handshake-o"></i>Sure?');
        }, 2000);
      }
    }
  },

  "click .chat.button": function(e, t) {
    if (!t.isSubbed.get()) {
      Meteor.call("tags/addActiveUser", self.tagId, function(err, res) {
        $("body > .content").fadeOut(100).fadeIn(100);
        setTimeout(function() {
          FlowRouter.go("/chats/tag/" + self.tagId);
        }, 100);
      });
    } else {
      $("body > .content").fadeOut(100).fadeIn(100);
      setTimeout(function() {
        FlowRouter.go("/chats/tag/" + self.tagId);
      }, 100);
    }
  }
})
