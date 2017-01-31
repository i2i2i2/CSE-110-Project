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
  }
})
