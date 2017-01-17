FlowRouter.notFound = {
  name: "404",
  action: function() {
    BlazeLayout.render('_404');
  }
}