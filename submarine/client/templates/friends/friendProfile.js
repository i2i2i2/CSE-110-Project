Template.FriendProfile.onCreated(function() {
  var self = this;
  self.change = false;
  self.userId = FlowRouter.current().params._id;
  self.autorun(function() {
    var isFriend = Meteor.user().profile.friends.find(user => user.userId == self.userId)? true: false;
    if (self.isFriend) {
      self.isFriend.set(isFriend);
    } else {
      self.isFriend = new ReactiveVar(isFriend);
    }
  });

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

  self.displayPopUp = function(message) {
    $("body").append('<p class="popup">' + message + '</p>');
    $(".popup").delay(1000).fadeOut(400);

    setTimeout(function() {
      $(".popup").remove();
    }, 1400);
  }
});

Template.FriendProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");
})

Template.FriendProfile.helpers({
  userId: () => FlowRouter.current().params._id,
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

  isFriend: () => Template.instance().isFriend.get(),

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

  hasGoogle: () => {
    var user = Meteor.users.findOne(Template.instance().userId);
    if (!user) return false;

    if(user.profile.socialMedia != null) {
      if(user.profile.socialMedia.google != null)
          return true;
    }
  },

  getGoogle: () => {
    var user = Meteor.users.findOne(Template.instance().userId);
    return user.profile.socialMedia.google;
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
    if (myTags){
      for (var i = 0; i < myTags.length; i++) {
        for (var j = 0; j < tagList.length; j++) {
          if (tagList[j].tagId == myTags[i].tagId) {
            return false;
          }
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
    if (tagList) {
      Meteor.user().profile.savedTags.forEach((tagA) => {
       tagList.forEach((tagB) => {
         if (tagA.tagId == tagB.tagId)
           intersectTag.push(tagA.tagId);
       });
      });
    }
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

  "click .tag_circle": function(e, t){
    var tagNumber = t.$(e.currentTarget).data('tagid');
    $("body > .content").fadeOut(100).fadeIn(100);
    setTimeout(function() {
      FlowRouter.go('/user/tag_profile/' + tagNumber);
    }, 100);
  },

  "click .unFriend.button": function(e, t){

    if (!$(e.currentTarget).hasClass("red")) {
      t.$(e.currentTarget).html('<i class="fa fa-chain-broken"></i>Sure?');
      t.$(e.currentTarget).addClass("red");

      self.dblclickTimeout = setTimeout(function() {
        self.change = false;
        t.$(e.currentTarget).html('<i class="fa fa-chain-broken"></i>UnFriend');
        t.$(e.currentTarget).removeClass("red");
      }, 2000);

    } else {

      $(e.currentTarget).html('<i class="fa fa-refresh fa-spin"></i>Removing');
      var idNumber = t.$(e.currentTarget).data('userid');
      Meteor.call('friends/deleteFriend', idNumber, function(err, res) {
        $("body > .content").fadeOut(800).fadeIn();
        setTimeout(function() {
          FlowRouter.go("/user/friends");
        }, 800);
        t.displayPopUp("UnFriended");
      });
    }
  },

  "click .addFriend.button": function(e, t){
    if (!$(e.currentTarget).hasClass("green")) {
      t.$(e.currentTarget).html('<i class="fa fa-handshake-o"></i>Sure?');
      t.$(e.currentTarget).addClass("green");

      setTimeout(function() {
        t.$(e.currentTarget).html('<i class="fa fa-handshake-o"></i>Add Friend');
        t.$(e.currentTarget).removeClass('green');
      }, 2000);

    }
    else {
      t.$(e.currentTarget).html('<i class="fa fa-refresh fa-spin"></i>Adding');

      var idNumber = t.$(e.currentTarget).data('userid');
      var friendRequest = Meteor.user().profile.friendRequest.map(user => user.userId);

      if(friendRequest && friendRequest.indexOf(idNumber) > -1){
        // Add friend
        Meteor.call('friends/addFriend', idNumber, function(err, res) {
          t.displayPopUp("Friend Added");
        });

      } else {
        // call sendRequest
        Meteor.call('friends/sendRequest', idNumber, function(err, res) {

          if (err) {
            t.displayPopUp("You are blocked")
          } else {
            t.displayPopUp("Request Sent");
          }
        });
      }
    }
  },

  "click .chat.button": function (e, t) {
     var idNumber = t.$(e.currentTarget).data('userid');
     $("body > .content").fadeOut(100).fadeIn(100);
     setTimeout(function() {
       FlowRouter.go('/chats/friend/'+idNumber);
     }, 100);
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
