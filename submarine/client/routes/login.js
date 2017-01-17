FlowRouter.route('/', {
  name: 'loading',
  action: () => {
    BlazeLayout.render('loading', {loader: 'loader', login: 'loginBox'});
  }
});
