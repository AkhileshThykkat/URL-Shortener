const authenticateJWT = require("../middlewares/checkToken");

const router = require("express").Router();

router.get("/shorten", authenticateJWT, (req, res) => {
  res.send("Shorten URL");
});

module.exports = router;
