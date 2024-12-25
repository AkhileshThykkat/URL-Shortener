const jwt = require("jsonwebtoken");
const envVariables = require("../utils/env_loader");
const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, envVariables.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = decoded; // Attach user info to request
    next();
  });
};

module.exports = authenticateJWT;
