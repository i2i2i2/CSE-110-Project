FlowRouter.route('/chats/friend/:friendId', {
  name: "friendChat",
  action: () => {
    BlazeLayout.render('mainLayout', {content: 'Chats'});
  }
});
