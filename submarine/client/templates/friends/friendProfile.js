Template.FriendProfile.onCreated(function() {
  var self = this;
  self.userId = FlowRouter.current().params._id;
  self.isFriend = Meteor.user().profile.friends.find(user => user.userId == self.userId)? true: false;

  if (!self.isFriend) {
    // temporarily add this person to client database
    self.subscribe("users/getStrangerProfile", self.userId);
  }

  $(".bottom.nav").addClass("hidden");

  this.displaySpan = function(parent, msg, isErr) {
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

    var tagList = user.profile.savedTags;
    var myTags = Meteor.user().profile.savedTags;
    for (var i = 0; i < myTags.length; i++) {
      for (var j = 0; j < tagList.length; j++) {
        if (tagList[j].tagId == myTags[i].tagId) {
          return false;
        }
      }
    }

    return true;
  },

  getIntersection: function() {
    var self = Template.instance();
    var user = Meteor.users.findOne(Template.instance().userId);
    if (!user) return false;


    var intersectTag = [];
    var tagList = user.profile.savedTags;
    Meteor.user().profile.savedTags.forEach((tagA) => {
       tagList.forEach((tagB) => {
         if (tagA.tagId == tagB.tagId)
           intersectTag.push(tagA.tagId);
       });
    });

    return intersectTag;
  },

  getName: function(tagId) {
    var tag = App.Collections.Tags.findOne(tagId);
    return tag? tag.name: "null";
    return name.length > 12? (name.substr(0, 10) + "...") : name;
  }
});

Template.FriendProfile.events({
  "click .fa-pencil": function(e, t) {
    // change wrapper to editing
    console.log("click pencil");
    var wrapper = $(e.currentTarget).parent();
    wrapper.addClass("editting");

    // focus to input
    var input = wrapper.find("input");
    input.prop("disabled", false);
    input.focus();
  },

  "click .fa-check-circle-o": function(e, t) {
    console.log("clicked");

    var self = Template.instance();
    var wrapper = $(e.currentTarget).parent();
    var input = wrapper.find("input");

    var newNickName = $(".nickName").val();
    if(!newNickName.length) {
        self.displaySpan(wrapper, "Empty Entry", true);

    } else {
      wrapper.addClass("load");
      Meteor.call('friends/editNickname', self.userId, newNickName, (error, res) => {
        if(error){
          self.displaySpan(wrapper, "Internal Error", true);
          $(".userName").val("");
        } else{
          self.displaySpan(wrapper, "Updated", false);
        }
        wrapper.removeClass("load");
      });
    }
  },

  "click .change_wrapper": function(e, t) {
    console.log("click");
    var input = $(e.currentTarget).find("input");

    var url;
    if (input.hasClass("email")) {
      url = "mailto:";
    } else if (input.hasClass("facebook")) {
      url = "https://www.facebook.com/";
    } else if (input.hasClass("github")) {
      url = "http://www.github.com/";
    }

    if (!url) return;
    url += input.attr("placeholder");

    console.log(url);
    if (Meteor.isCordova) {
      navigator.app.loadUrl(url, { openExternal: true });
    } else {
      window.open(url);
    }
  },

  "click .chat.button": function (e, t) {
     var idNumber = t.$(e.currentTarget).data('userid');

     FlowRouter.go('/chats/friend/'+idNumber);
  },

  "blur input": function(e, t) {
    var input = $(e.currentTarget);
    var wrapper = input.parent();
    var self = Template.instance();

    input.prop("disabled", true);
    setTimeout(function() {
      wrapper.removeClass("editting");
      if (!wrapper.hasClass("load")) {
        input.val("");
      }
    }, 200);
  }
});

