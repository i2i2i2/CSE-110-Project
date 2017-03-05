Template.Home.onRendered(function() {
  var self = this;
  Session.set("currentTemplate", "home");
});

Template.Home.helpers({

    "greetingName": () => Meteor.userId()? Meteor.user().username : null,

    "emptyTags": function() {
        if(Meteor.user().profile.savedTags == null || Meteor.user().profile.savedTags.length === 0) {
            return true;
        }
    },

    "recentTags": () => {
      if (!Meteor.userId()) return;

      var latestMsg = Session.get("latestMsg");
      var tags = Meteor.user().profile.savedTags.slice();

      if (!latestMsg) return tags;

      tags = tags.map((tag) => {
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

      return tags;
    },

    "emptyFriends": function() {
        if(Meteor.user().profile.friends == null || Meteor.user().profile.friends.length === 0) {
            return true;
        }
    },

    recentFriends: () => {
      if (!Meteor.userId()) return;

      console.log("runned");

      var latestMsg = Session.get("latestMsg");
      console.log(JSON.stringify(latestMsg, undefined, 2))
      var friends = Meteor.user().profile.friends;

      if (!latestMsg) return friends;

      friends = friends.map((friend) => {
        friend.latestMsg = latestMsg[friend.userId];
        return friend;

      }).sort(function(friend1, friend2) {
        if (friend1.latestMsg) {
          if (friend2.latestMsg) {
            return -friend1.latestMsg.time.getTime() + friend2.latestMsg.time.getTime();
          } else {
            return -friend1.latestMsg.time.getTime();
          }
        } else {
          if (friend2.latestMsg) {
            return friend2.latestMsg.time.getTime();
          } else {
            return 0;
          }
        }
      });

      console.log(JSON.stringify(friends, undefined, 2));

      return friends;
    },

    randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null,

    tagName: (id) => App.Collections.Tags.findOne(id).name,

    profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

    getName: (id, nickname) => nickname? nickname: Meteor.users.findOne(id).username,

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
    }
});

Template.mainLayout.events({
  "click .avatar_circle": function () {
    FlowRouter.go('/user/profile');
  },

  "click .tag_circle": function (e, t) {
    var idNumber = t.$(e.currentTarget).data('tagid');

    FlowRouter.go('/chats/tag/'+idNumber);
  },

  "click .name_circle": function (e, t) {
    var idNumber = t.$(e.currentTarget).data('userid');

    FlowRouter.go('/chats/friend/'+idNumber);
  }

});
