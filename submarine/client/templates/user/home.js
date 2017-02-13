Template.Home.onRendered(function() {
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

    randomPic: () => Meteor.userId()? Random.id() : null

})

