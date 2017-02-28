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

    recentTags: () => Meteor.userId()? Meteor.user().profile.savedTags : null,

    "emptyFriends": function() {
        if(Meteor.user().profile.friends == null || Meteor.user().profile.friends.length === 0) {
            return true;
        }
    },

    recentFriends: () => Meteor.userId()? Meteor.user().profile.friends : null,

    randomSeed: () => Meteor.userId()? Meteor.user().profile.profileSeed : null,

    tagName: (id) => App.Collections.Tags.findOne(id).name,

    profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,

    getName: (id, nickname) => nickname? nickname: Meteor.users.findOne(id).username
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
