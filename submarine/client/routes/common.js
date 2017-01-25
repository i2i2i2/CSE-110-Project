FlowRouter.notFound = {
  name: "404",
  action: function() {
    BlazeLayout.render('_404');
  }
};

FlowRouter.route('/debug', {
  name: 'debug',
  action: () => {
    BlazeLayout.render('Loading', {loader:'Debug', login: 'Debug'});
  }
});
