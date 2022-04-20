const config = require("config");
const jwt = require("jsonwebtoken");

// middleware to check if request is authenticated or not
module.exports = function (req, res, next) {
  // getting token from the request
  const token = req.header("x-auth-token");
  // if token does not exist then reject request with 401 status
  if (!token) return res.status(401).send("Access Denied. No token provided.");

  // else verify and decode token and continue with operation
  try {
    const decode = jwt.verify(token, config.get("jwtPrivateToken"));
    req.user = decode;
    next();
  } catch (ex) {
    // reject request with error 400
    return res.status(400).send("Invalid Token.");
  }
};
