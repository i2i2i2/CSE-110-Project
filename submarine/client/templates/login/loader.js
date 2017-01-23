Template.Loader.onRendered(() => {
  setTimeout(() => {
    FlowRouter.go("/user/home");
  }, 2000);
});
