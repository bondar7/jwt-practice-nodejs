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
  console.log("refreshToken:", refreshToken);
  
  const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(404);
  try {
  //verify JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err || decodedToken.username !== foundUser.username) res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      //generate new access token
      const accessToken = jwt.sign(
        { 
          "UserInfo": {
            username: decodedToken.username,
            roles: roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
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
      fs.writeFileSync(path.join(__dirname, "..", "data", "users.json"), JSON.stringify(usersDB.users));
      res.cookie("jwt", refreshToken, {httpOnly: true, sameSite: "None", partitioned: true, secure: true});
      res.json({accessToken});
      console.log("generated access token: ", accessToken);
      console.log("generated refresh token: ", refreshToken);
      
    }
  );
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
};

module.exports = {handleRefreshToken};