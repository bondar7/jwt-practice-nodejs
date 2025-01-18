const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersController = require("../db/usersController");

const handleLogin = async (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) return res.status(400).json({message: "Username and password are required!"});
  const foundUser = await usersController.userExists(username, null);
  if (!foundUser) return res.sendStatus(404);
  try {
    if (!await bcrypt.compare(password, foundUser.password)) return res.status(404).json({message: "Invalid password."});
    const roles = Object.values(foundUser.roles); // gets only values from properties and puts them in array.
    //creating JWTs
    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          id: foundUser._id,
          username: foundUser.username,
          roles: roles 
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { 
        username: foundUser.username
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await usersController.updateRefreshToken(foundUser.username, refreshToken);
    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", partitioned: true, secure: true });
    res.status(200).json({accessToken});
    console.log(accessToken);
  } catch (err) {
    res.sendStatus(500);
  }
}

module.exports = {handleLogin};