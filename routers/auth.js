const jwt = require("jsonwebtoken");
const router = require("express").Router();
const passport = require("../utils/auth");
const envVariables = require("../utils/env_loader");

router.get(
  "/auth/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT
    const payload = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
    const token = jwt.sign(payload, envVariables.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token }); // Send the token to the client
  }
);

module.exports = router;
