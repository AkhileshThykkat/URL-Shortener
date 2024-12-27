const jwt = require("jsonwebtoken");
const router = require("express").Router();
const passport = require("../utils/auth");
const envVariables = require("../utils/env_loader");

const { user_service } = require("../services");

/**
 * @swagger
 * /auth/google/login:
 *   get:
 *     summary: Initiates Google OAuth login
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects the user to Google's OAuth 2.0 login page.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/auth/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handles Google OAuth callback
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns a JWT token upon successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *                 type:
 *                   type: string
 *                   description: Token type (Bearer).
 *       401:
 *         description: Unauthorized, user not authenticated.
 *       500:
 *         description: Internal server error.
 */
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
