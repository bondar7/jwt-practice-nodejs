const userDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
};

const bcrypt = require("bcrypt");

const handleRegistration = (req, res, next) => {
  
};

module.exports = { handleRegistration };