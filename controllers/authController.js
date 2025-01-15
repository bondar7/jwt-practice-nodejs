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
    //creating JWTs
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const otherUsers = usersDB.users.filter(user => user.username !== foundUser.username);
    const currentUser = {...foundUser, refreshToken};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, "..", "data", "users.json"), JSON.stringify(usersDB.users));
    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true });
    res.status(200).json({accessToken});
    console.log(accessToken);
  } catch (err) {
    res.sendStatus(500);
  }
}

module.exports = {handleLogin};