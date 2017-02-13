Template.mainLayout.onCreated(function() {
  this.autorun(() => {
    if (!Meteor.userId()) {
      FlowRouter.go("/");
      return;
    }
    this.subHandle = this.subscribe("users/relatedUsersAndTags");
    this.subHandle2 = this.subscribe("users/strangersUserId");
  });
});

Template.mainLayout.onRendered(function() {
  var self = this;
  self.autorun(function() {
    var currentTemplate = Session.get("currentTemplate");
    self.$(".button").removeClass("active");
    self.$(".button[data-link=" + currentTemplate + "]").addClass("active");
  });
});

Template.mainLayout.onDestroyed(function() {
  this.subHandle.stop();
})

Template.mainLayout.events({
  "click .button": function (e, t) {
    var link = t.$(e.currentTarget).data('link');

    if (!link) return;

    FlowRouter.go('/user/' + link);
  }
});

Template.mainLayout.helpers({
  "username": function() {
    return Meteor.user()? Meteor.user().username : null;
  },
  "subReady": function() {
    return Template.instance().subscriptionsReady();
  }
})
