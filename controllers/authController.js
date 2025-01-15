const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = (req, res, next) => {

}

module.exports = {handleLogin};