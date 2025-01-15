const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) return res.status(400).json({message: "Username and password are required!"});
  const foundUser = usersDB.users.find(user => user.username === username);
  if (!foundUser) return res.sendStatus(404);
  try {
    if (!await bcrypt.compare(password, foundUser.password)) return res.status(404).json({message: "Invalid password."});
    res.status(200).json({message: "You've logged in."})
  } catch (err) {
    res.sendStatus(500);
  }
}

module.exports = {handleLogin};