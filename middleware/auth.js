const jwt = require("jsonwebtoken");
const config = require("config");
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); // verify the token
    req.user = decoded; // this this the token payload
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
