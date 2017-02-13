/**
 * Seed users collection, for testing
 */
App.Seeder.Users = function() {

  if (!Accounts.findUserByUsername("Ensign")) {
    Accounts.createUser({
      username: "Ensign",
      email: "ensign@aa.aa",
      password: "asdfqwer"
    });
  }

  if (!Accounts.findUserByUsername("Lieutenant")) {
    Accounts.createUser({
      username: "Lieutenant",
      email: "Lieutenant@aa.aa",
      password: "asdfqwer"
    });
  }

  if (!Accounts.findUserByUsername("Commander")) {
    Accounts.createUser({
      username: "Commander",
      email: "Commander@aa.aa",
      password: "asdfqwer"
    });
  }

  if (!Accounts.findUserByUsername("Captain")) {
    Accounts.createUser({
      username: "Captain",
      email: "Captain@aa.aa",
      password: "asdfqwer"
    });
  }

  if (!Accounts.findUserByUsername("Admiral")) {
    Accounts.createUser({
      username: "Admiral",
      email: "Admiral@aa.aa",
      password: "asdfqwer"
    });
  }

  if (!Accounts.findUserByUsername("JohnD")) {
    Accounts.createUser({
      username: "JohnD",
      email: "JohnD@aa.aa",
      password: "asdfqwer"
    });
  }

  if (!Accounts.findUserByUsername("JaneD")) {
    Accounts.createUser({
      username: "JaneD",
      email: "JaneD@aa.aa",
      password: "asdfqwer"
    });
  }
};
