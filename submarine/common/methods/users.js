Meteor.methods({
  'user/rollProfilePicture': function() {
    // research isSimulation
    if (this.isSimulation) return;

    // only server runs the code
    var profileSeed = Random.id(8);
    console.log("New Seed " + profileSeed);
    return Meteor.users.update({"_id": this.userId},
                               {$set: {"profile.profileSeed": profileSeed}});
  },
    
    'user/rollChatroomPicture': function() {
    // research isSimulation
    if (this.isSimulation) return;

    // only server runs the code
    var chatroomSeed = Random.id(7);
    console.log("New Seed " + chatroomSeed);
    return Meteor.users.update({"_id": this.userId},
                               {$set: {"chat.chatroomSeed": chatroomSeed}});
  },

  'user/changeEmail': function(newEmail) {
  	if (this.isSimulation) return;
  	console.log(newEmail);
  	return Meteor.users.update({"_id": this.userId},
  								{$set: {"emails.0.address": newEmail}});
  },

  'user/changeUserName': function(newUserName) {
  	if (this.isSimulation) return;
  	console.log(newUserName);

    if (Accounts.findUserByUsername(newUserName)){
      throw new Meteor.Error("Sorry, this username already exists.");
      return false;
    }
    else{
      console.log("Successfully changed username!");
      return Meteor.users.update({"_id": this.userId},
    								{$set: {"username": newUserName}});
    }
  },

  'user/checkUsername': function(newUsername) {
    if (this.isSimulation) return;

    if (Accounts.findUserByUsername(newUsername)) {
      throw new Meteor.Error("Unsername Exists");
      return false;
    }
  },

  'user/checkEmail': function(newEmail) {
    if (this.isSimulation) return;

    if (Accounts.findUserByEmail(newEmail)) {
      throw new Meteor.Error("Unsername Exists");
      return false;
    }
  }
  //,
    /*
  'user/sendMsg': function (options) {
    if (receiver offline) {
      App.Services.sendOfflineMessaege(options);
      }
  }
  */

})
