const jwt = require("jsonwebtoken");
const router = require("express").Router();
const passport = require("../utils/auth");
const envVariables = require("../utils/env_loader");

const { user_service } = require("../services");

router.get(
  "/auth/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    // check for an existing user
    const user = await user_service.findUserByEmail(req.user.email);
    // console.log(user);
    if (!user) {
      // create a new user
      await user_service.saveUser({
        email: req.user.email,
        name: req.user.name,
        googleId: req.user.id,
      });
    }
    const payload = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
    const token = jwt.sign(payload, envVariables.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token: token, type: "Bearer" });
  }
);

module.exports = router;
