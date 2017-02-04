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
  'user/changeEmail': function(newEmail) {
  	if (this.isSimulation) return;
  	console.log(newEmail);
  	return Meteor.users.update({"_id": this.userId},
  								{$set: {"emails.0.address": newEmail}});
  },

  'user/changeUserName': function(newUserName) {
  	if (this.isSimulation) return;
  	console.log(newUserName);
    //Meteor.users.find({username: newUsername}).count()==0
    if (true){
      console.log("Successfully changed username!");
      return Meteor.users.update({"_id": this.userId},
    								{$set: {"username": newUserName}});
    }
    else{
      throw new Meteor.Error("Sorry, this username already exists.");
      return false;
    }

  }
})
