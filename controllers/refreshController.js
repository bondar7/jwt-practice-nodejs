const jwt = require("jsonwebtoken");
const usersController = require("../db/usersController");

const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.status(400).json({message: "cookies are required!"});
  const refreshToken = cookies.jwt;
  console.log("refreshToken:", refreshToken);
  const foundUser = await usersController.userExists(null, refreshToken);
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
            id: foundUser._id,
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
      usersController.updateRefreshToken(decodedToken.username, refreshToken).then(() => {
        res.cookie("jwt", refreshToken, {httpOnly: true, sameSite: "None", partitioned: true, secure: true});
        res.json({accessToken});
        console.log("generated access token: ", accessToken);
        console.log("generated refresh token: ", refreshToken);
      });
    }
  );
  } catch (err) {
    res.sendStatus(500);
    console.log(err);
  }
};

module.exports = {handleRefreshToken};