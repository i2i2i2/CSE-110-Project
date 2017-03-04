Template.FriendProfile.onRendered(function() {
  var self = this;
  $(".bottom.nav").addClass("hidden");
  Session.set("currentTemplate", "friend_profile");
});

Template.FriendProfile.onDestroyed(function() {
  $(".bottom.nav").removeClass("hidden");  
});

Template.FriendProfile.helpers({
  profileSeed: (id) => Meteor.users.findOne(id).profile.profileSeed,
  
  getName: function(id, nickname){ 
      var name = Meteor.users.findOne(id).username;
      if (nickname){
        var friendsList = Meteor.user().profile.friends;
        var friendId = FlowRouter.current().params._id; 
        for(var i=0; i<friendsList.length;i++){
                
          if (friendsList[i].userId == friendId) {
            return friendsList[i].nickname;
          }
        }
      }
      return name;
  },
    
  userId: () => FlowRouter.current().params._id,

  getFacebook: () => Meteor.userId()? Meteor.user().socialMedia.facebook: null,

  getGoogle: () => Meteor.userId()? Meteor.user().socialMedia.google: null,

  getGithub: () => Meteor.userId()? Meteor.user().socialMedia.github: null
});

Template.FriendProfile.events({
  "click .button_back": function (e, t) {
    var id = t.$(e.currentTarget).data('userid');
    FlowRouter.go('/chats/friend/'+id);
  },
    
  "blur .editName": function(){
    var message = $('#edit_name').val();
    if( message != self.message){  
      self.message = message;
      Meteor.call('friends/editNickname', Meteor.userId(), FlowRouter.current().params._id, message);
    }
  }
    
});
