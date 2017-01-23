FlowRouter.route('/', {
  name: 'loading',
  action: () => {
    BlazeLayout.render('Loading', {loader: 'Loader', login: 'LoginBox'});
  }
});
