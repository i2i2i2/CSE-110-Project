FlowRouter.route('/chats/friend/:friendId', {
  name: "friendChat",
  action: () => {
    BlazeLayout.render('mainLayout', {content: 'Chats'});
  }
});

FlowRouter.route('/chats/tag/:tagId', {
  name: "tagChat",
  action: () => {
    BlazeLayout.render('mainLayout', {content: 'tagChats'});
  }
});
