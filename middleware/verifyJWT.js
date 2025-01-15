const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  
  if (!authHeader) return res.sendStatus(403); // No Authorization header
  const token = authHeader.split(" ")[1];
  if(!token) return res.sendStatus(403); // No token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decodedToken) => {
      if (err) return res.sendStatus(403); // Invalid Token
      req.user = decodedToken;
      console.log("JWT is correct");
      next();
    }
  )
}

module.exports = verifyJWT;