Template.mainLayout.onCreated(() => {
  console.log("Welcome Back!")
});

Template.mainLayout.onRendered(() => {
  console.log("Now you see me.")
});

Template.mainLayout.helpers({
  authInProgress: () => false;
})
