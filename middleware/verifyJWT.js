const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(authHeader);
  
  if (!authHeader?.startsWith("Bearer")) return res.sendStatus(403); // No Authorization header
  const token = authHeader.split(" ")[1];
  if(!token) return res.sendStatus(403); // No token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.sendStatus(401); // Expired Token
        } else {
          return res.sendStatus(403); // Invalid Token
        }
      }; // Invalid Token
      req.user = decodedToken.UserInfo;
      console.log(decodedToken);
      console.log("TOKEN IS VALID");
      
      next();
    }
  )
}

module.exports = verifyJWT;