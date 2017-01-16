var userRoutes = FlowRouter.group({
  prefix: '/student',
  name: 'student'
});

userRoutes.route('/home', {
  name: "userHome",
  action() {
    BlazeLayout.render('mainLayout', {content: 'userHome'});
  }
});

userRoutes.route('/friends', {
  name: "friends",
  action() {
    BlazeLayout.render('mainLayout', {content: 'friends'});
  }
});


userRoutes.route('/places', {
  name: "places",
  action() {
    BlazeLayout.render('mainLayout', {content: 'places'});
  }
});

userRoutes.route('/chats/:id', {
  name: "chats",
  action() {
    BlazeLayout.render('mainLayout', {content: 'chats'})
  }
});
