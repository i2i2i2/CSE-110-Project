FlowRouter.route('/', {
  name: 'loading',
  action: () => {
    BlazeLayout.render('Loading', {loader: 'Loader', login: 'Login'});
  }
});

FlowRouter.route('/ForgotPassword', {
  name: 'loading',
  action: () => {
    BlazeLayout.render('Loading', {loader: 'Loader', login: 'ForgotPassword'});
  }
});
