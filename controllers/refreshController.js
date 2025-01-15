const usersDB = {
  users: require("../data/users.json"),
  setUsers: function(users) {this.users = users}
}

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.status(400).json({message: "cookies are required!"});
  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(404);
  try {
      //verify JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err || decodedToken.username !== foundUser.username) res.sendStatus(403);
      //generate new access token
      const accessToken = jwt.sign(
        { username: decodedToken.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );
      //generate new refresh token
      const refreshToken = jwt.sign(
        { username: decodedToken.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const otherUsers = usersDB.users.filter(user => user.username !== decodedToken.username); 
      const updatedUser = {...foundUser, refreshToken};
      usersDB.setUsers([...otherUsers, updatedUser]);
      fs.writeFileSync(path.join(__dirname, "..", "data", "users.json"), usersDB.users);
      res.cookie("jwt", refreshToken, {httpOnly: true, sameSite: "None", secure: true});
      res.json({accessToken});
    }
  );
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {handleRefreshToken};