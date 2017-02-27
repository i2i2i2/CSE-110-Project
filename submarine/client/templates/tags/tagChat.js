Template.tagChats.onCreated(function() {
  var self = this;

  self.autorun(() => {
    console.log("autorunned");
    FlowRouter.watchPathChange(); // reactive source

    self.tagId = FlowRouter.current().params.tagId;
    self.userId = Meteor.userId();

    var tag = Meteor.user().profile.savedTags.find((element) => element.tagId == self.tagId);
    self.joinTime = tag? (tag.joinSince? tag.joinSince: new Date(0)) : new Date(0);
    self.oldestMsg = 0;
    self.preOldestMsg = -1;
    self.historyChange = new ReactiveVar(0);
    self.newMsg = new ReactiveVar(0);
    self.newLeft = new ReactiveVar(0);
    self.scrollPos = 0;
    self.timeStamp = 0;
    self.addToBottom = true;
    self.history = new ReactiveVar([]);
    if (self.watchCursor)
      self.watchCursor.stop();
    if (self.oldestMsg < self.preOldestMsg)
      self.preOldestMsg = -1;

    self.subscribe('chat/tagChats', self.tagId, () => {
      // get cursor and watch cursor
      var newHistoryCursor = App.Collections.Message.find({
          is_public: true,
          receiver: self.tagId
        }, {sort: {time: -1}});

      self.watchCursor = newHistoryCursor.observeChanges({
        "added": function(id, fields) {
          fields._id = id;
          console.log(fields);
          var history = self.history.get();
          history.push(fields);
          self.historyChange.set(self.historyChange.get() + 1);
          self.history.set(history);
          self.addToBottom = true;

          var container = document.getElementsByClassName("messages")[0];
          if (container.scrollTop < container.scrollHeight - container.clientHeight - 30) {
            $(".floater[data-action=\"down\"]").removeClass("hidden");
            self.newMsg.set(self.newMsg.get() + 1);
          } else {
            self.newMsg.set(0);
          }
        }
      });

      if (self.preOldestMsg < self.oldestMsg && localStorage.getItem(self.tagId)) {
        console.log("before call");
        var history = newHistoryCursor.fetch();

        if (newHistoryCursor.count() == 0) return;
        self.history.set(newHistoryCursor.fetch());

      // call is done
      } else {
        console.log("after call or no call")
        self.historyChange.set(self.historyChange.get() + 1);
        if (newHistoryCursor.count() == 0) return;
        self.history.set(self.history.get().concat(newHistoryCursor.fetch()));
      }
    });

    // avoid repeating
    if (self.preOldestMsg < self.oldestMsg && localStorage.getItem(self.tagId)) {
      console.log("called");
      self.preOldestMsg = self.oldestMsg;
      Meteor.call("chats/getHistory", self.tagId, new Date(localStorage.getItem(self.tagId)), self.joinTime, true, true, function(err, res) {
        if (err) return;

        var pastHistory = res.history.reverse();

        console.log("callback")
        if (!res.history.length) {
          //TODO: display no more histories

          return;
        }

        console.log("have response");

        self.oldestMsg = pastHistory[0].time;
        self.newLeft.set(res.leftNew);

        // if all done
        if (self.subscriptionsReady()) {
          self.history.set(pastHistory.concat(self.history.get()));
          self.historyChange.set(self.historyChange.get() + 1);

        // call return first
        } else {
          self.history.set(pastHistory);
        }

        self.addToBottom = false;
      });
    }
  });

  $(".bottom.nav").addClass("hidden");
});

Template.tagChats.onRendered(function() {

  var self = this;
  self.mouseDownY = -1;
  self.lastPointY = -1;
  self.threshHold = $(window).width() * 1.5 / 5;
  self.refreshing = true;
  self.container = document.getElementsByClassName("messages")[0];

  // add touch move event listeners here
  $(".messages").scroll(function(event) {
    console.log("scrolled");
    $(".floater").addClass("hidden");
  });


  // event listeners
  self.handleScroll = function(event) {
    console.log("scrolled");
    $(".floater").addClass("hidden");
  }

  self.handleTouchDown = function(event) {

    if (self.historyChange.get() == 0 || self.refreshing) return;

    var touch = event.touches.item(0);
    if(!$.contains(document.getElementsByClassName("submarine_bg")[0],event.target))
      return;

    self.lastPointY = self.mouseDownY = event.touches.item(0).pageY;
    $(".loading.hidden").removeClass("hidden");
    self.container.addEventListener('touchmove', self.handleTouchMove);
  };

  self.handleTouchMove = function(event) {
    if (self.refreshing) return;

    var pageY = event.touches.item(0).pageY;
    self.lastPointY = pageY;
    var diff = self.lastPointY - self.mouseDownY;

    if (diff < 0) diff = 0;
    if (diff > self.threshHold) {
      diff = self.windowHeight;
      if (!self.refreshing) {
        self.refreshing = true;

        $(".messages").removeAttr("style");
        $(".messages").addClass("refreshing");

        // call pastHistory
        self.preOldestMsg = self.oldestMsg;
        Meteor.call("chats/getHistory", self.tagId, self.oldestMsg, self.joinTime, true, false, function(err, res) {
          if (err) return;

          $(".messages").removeClass("refreshing");
          var history = self.history.get();
          self.historyChange.set(self.historyChange.get() + 1);
          self.history.set(res.history.concat(history));

          self.addToBottom = false;
        });
      }
    }

    self.$(".messages").css("top", "calc(" + diff / 1.5 + "px)");
  };

  self.handleTouchUp = function(event) {
    $(".messages").removeAttr("style");
    self.container.removeEventListener("touchmove", self.handleTouchMove);
  };
});

Template.tagChats.onDestroyed(function() {
  if (self.watchCursor)
    self.watchCursor.stop();

  $(".bottom.nav").removeClass("hidden");
});

Template.tagChats.events({
  "click .button[data-action=\"send\"]": function(e, t) {
    var now = new Date();
    var msg = {
      is_public: true,
      sender: Meteor.userId(),
      receiver: t.tagId,
      message: Fake.sentence(3) + " " + now.toTimeString().split(" ")[0],
      time: now,
      rate: 80
    };

    Meteor.call("chats/sendMsg", msg);
  },
  "click .button[data-action=\"back\"]": function(e, t) {
    FlowRouter.go("/user/home");
  },
  "click .floater[data-action=\"down\"]":function(e, t) {
    console.log("click down");
    var container = document.getElementsByClassName("messages")[0];
    container.scrollTop = container.scrollHeight - container.clientHeight;
    $("floater[data-action=\"down\"]").addClass("hidden");
    setTimeout(function() { t.newMsg.set(0); }, 500);
  },
  "click .floater[data-action=\"up\"]": function(e, t) {
    self.container.scrollTop = 0;
    $(".messages").addClass("refreshing");
    Meteor.call("chats/getHistory", self.tagId, self.oldestMsg, self.joinTime, true, false, function(res) {

      $(".messages").removeClass("refreshing");
      var history = self.history.get();
      self.historyChange.set(self.historyChange.get() + 1);
      self.history.set(res.history.reverse().concat(history));
      self.addToBottom  = false;
    });
  }
})

Template.tagChats.helpers({
  "initSubNotReady": function() {
    var self = Template.instance();
    return self.historyChange.get() == 0;
  },
  "hasLeftNew": function() {
    var newleft = Template.instance().newLeft.get();
    return newleft != 0 ? "" : "hidden";
  },
  "leftNew": function() {
    var newleft = Template.instance().newLeft.get();
    return newleft ==  100? "99+" : newleft;
  },
  "hasNewMsg": function() {
    var newleft = Template.instance().newMsg.get();
    return newleft != 0 ? "" : "hidden";
  },
  "newMsg": function() {
    return Template.instance().newMsg.get();
  },
  "messageChanged": function() {
    var self = Template.instance();
    return self.historyChange && self.historyChange.get() != 0;
  },
  "messages": function() {
    var history = Template.instance().history.get();
    if (history.length)
      localStorage.setItem(Template.instance().tagId, history[history.length - 1].time.toISOString());
    return Template.instance().history.get();
  },
  "seperate": function(time, startNew) {
    var self = Template.instance();

    if (startNew) {
      self.lastMsgTime = time;
      return Spacebars.SafeString('<div class="msg_wrapper"><p class="new_msg seperate"> Below are new messages </p></div>');
    }

    if (!self.lastMsgTime) {
      self.lastMsgTime = time;
      return "";
    } else {
      if (Math.abs(self.lastMsgTime - time) > 300000) {
        self.lastMsgTime = time;
        var seperate = new Date(time);
        var time = (seperate.getHours() < 10? ("0" + seperate.getHours()):  seperate.getHours()) + " : "
                 + (seperate.getMinutes() < 10? ("0" + seperate.getMinutes()):  seperate.getMinutes());
        return Spacebars.SafeString('<div class="msg_wrapper"><p class="seperate">' + time + "</p></div>");
      }

      return "";
    }
  },
  "watchScroll": function() {
    // get reactive source
    var self = Template.instance();
    self.historyChange.get() != 0;
    var container = document.getElementsByClassName("messages")[0];
    if (container.scrollTop + container.clientHeight > container.scrollHeight - 50) {
      self.scrollPos = "bottom";
      console.log("at bottom");
    } else {
      if (self.addToBottom) {
        self.scrollPos = container.scrollTop;

      } else {
        self.scrollPos = container.scrollHeight - container.scrollTop;
      }
    }
  },
  "scrollToPlace": function() {
    var self = Template.instance();
    var container = document.getElementsByClassName("messages")[0];

    setTimeout(function() {
      if (self.scrollPos == "bottom") {
        container.scrollTop = container.scrollHeight - container.clientHeight;
        console.log("bottom");
      } else {
        if (self.addToBottom) {
          container.scrollTop = self.scrollPos;
        } else {
          container.scrollTop = container.scrollHeight - self.scrollPos;
        }
      }
    }, 50);

  },
  "ownMsg": function(id) {
    return id == Meteor.userId();
  },
  "profileSeed": function(id) {
    var user = Meteor.users.findOne(id);
    return user? user.profile.profileSeed: "";
  }
});
