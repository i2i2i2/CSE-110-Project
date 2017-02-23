Template.tagChats.onCreated(function() {
  var self = this;
  self.tagId = FlowRouter.current().params.tagId;
  self.userId = Meteor.userId();
  self.lastRead = Session.get(self.tagId);
  self.limit = new ReactiveVar(25);

  // subscribe new messages
  this.subscribe('chat/tagChats', self.tagId, self.lastRead, true, null);
  this.subscribe('tags/usersUnderTag', self.tagId);
  // subscribe old messages
  if (self.lastRead) {
    this.autorun(() => {
      this.subscribe('chat/tagChats', self.tagId, self.lastRead, false, self.limit.get());
    });
  }

  $(".bottom.nav").addClass("hidden");
});

Template.tagChats.onDestroyed(function() {
  if (App.Collections.Message.findOne({receiver: this.tagId})) {
    Session.setPersistent(this.tagId, Date.now());
  }
  $(".bottom.nav").removeClass("hidden");
});

Template.tagChats.events({
  "click .button[data-action=\"send\"]": function(e, t) {
    var now = new Date();
    App.Collections.Message.insert({
      is_public: true,
      sender: Meteor.userId(),
      receiver: "X6MeJpG3ZfHGiqecW",
      message: Fake.sentence(3) + " " + now.toTimeString().split(" ")[0],
      time: now,
      rate: 80
    });
  }
})

Template.tagChats.helpers({
  "newMessages": function() {
    var self = Template.instance();
    if (self.lastRead) {
      return App.Collections.Message.find({
        receiver: self.tagId,
        time: {
          $gt: new Date(self.lastRead)
        }
      }, {sort: {time: 1}}).fetch();
    } else {
      return App.Collections.Message.find({
        receiver: self.tagId
      }).fetch();
    }
  },
  "hasPastMessages": function() {
    return !!Template.instance().lastRead;
  },
  "pastMessages": function() {
    var self = Template.instance();
    return App.Collections.Message.find({
      time: {
        $lte: new Date(self.lastRead)
      }
    }, {sort: {time: 1}}).fetch();
  },
  "subNotReady": function() {
    return !Template.instance().subscriptionsReady();
  },
  "timeSeperate": function(time) {
    var self = Template.instance();
    if (!self.lastMsgTime) {
      self.lastMsgTime = time;
      return "";
    } else {
      if (Math.abs(self.lastMsgTime - time) > 300000) {
        self.lastMsgTime = time;
        var seperate = new Date(time);
        var time = (seperate.getHours() < 10? ("0" + seperate.getHours()):  seperate.getHours()) + " : ";
        time += (seperate.getMinutes() < 10? ("0" + seperate.getMinutes()):  seperate.getMinutes());
        return Spacebars.SafeString('<div class="msg_wrapper"><p class="seperate">' + time + "</p></div>");
      }
      return "";
    }
  },
  "scrollDown": function() {
    console.log("scrollDown");
  },
  "ownMsg": function(id) {
    return id == Meteor.userId();
  },
  "profileSeed": function(id) {
    console.log(id);
    var user = Meteor.users.findOne(id);
    return user? user.profile.profileSeed: "";
  }
})
