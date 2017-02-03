/* The functionality for user sign-up */

Template.Login.events({
    "click .button[data-action='login']": function(e,t){
        console.log("New user sign up!");

        //store value of the form fields into 3 variables 
        var username = $('[]').val();
        var email = $('[]').val();
        var password = $('[]').val();

        //create account using meteor built-in function
        Accounts.createUser({
            username: username,
            email: email,
            password: password
        });
    }
});