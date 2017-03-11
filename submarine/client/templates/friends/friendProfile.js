Template.FriendProfile.onCreated(function() {
  var self = this;
  self.userId = FlowRouter.current().params._id;
  self.isFriend = Meteor.user().profile.friends.find(user => user.userId == self.userId)? true: false;

  if (!self.isFriend) {
    // temporarily add this person to client database
    self.subscribe("users/getStrangerProfile", self.userId);
  }

  $(".bottom.nav").addClass("hidden");
});

Template.FriendProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
})

Template.FriendProfile.helpers({
  randomSeed: () => {
    var self = Template.instance();
    var user = Meteor.users.findOne(self.userId);
    return user? user.profile.profileSeed : "";
  },

  getUserName: function(){
    var self = Template.instance();
    var user = Meteor.users.findOne(self.userId);
    if (user)
      return user.username? user.username: "???";
    else
      return "???";
  },

  getNickName: function() {
    var self = Template.instance();
    var user = Meteor.user().profile.friends.find(user => user.userId == self.userId);
    if (user)
      return user.nickname? user.nickname: "Add Custom Name";
    else {
      return "Add Custom Name";
    }
  },

  isFriend: () => Template.instance().isFriend,

  getEmail: () => {
    var user = Meteor.users.findOne(Template.instance().userId);
    return user.emails[0].address;
  },

  hasFacebook: () => {
    var user = Meteor.users.findOne(Template.instance().userId);
    if (!user) return false;

    if(user.profile.socialMedia != null) {
      if(user.profile.socialMedia.facebook != null)
          return true;
    }
  },

  getFacebook: () => {
    var user = Meteor.users.findOne(Template.instance().userId);
    return user.profile.socialMedia.facebook;
  },

  hasGithub: () => {
    var user = Meteor.users.findOne(Template.instance().userId);
    if (!user) return false;

    if(user.profile.socialMedia != null) {
      if(user.profile.socialMedia.github != null)
          return true;
    }
  },

  getGithub: function() {
    var user = Meteor.users.findOne(Template.instance().userId);
    return user.profile.socialMedia.github;
  },

  hasNoIntersection: function() {
    var self = Template.instance();
    var user = Meteor.users.findOne(Template.instance().userId);
    if (!user) return false;


    self.intersectTag = [];
    var tagList = user.profile.savedTags;
    Meteor.user().profile.savedTags.forEach((tagA) => {
       tagList.forEach((tagB) => {
         if (tagA.tagId == tagB.tagId)
           self.intersectTag.push(tagA.tagId);
       });
    });

    return self.intersectTag.length == 0;
  },

  getIntersection: function() {
    return Template.instance().intersectTag;
  },

  getName: function(tagId) {
    var tag = App.Collections.Tags.findOne(tagId);
    return tag? tag.name: "null";
    return name.length > 12? (name.substr(0, 10) + "...") : name;
  }
});

Template.FriendProfile.events({

});
