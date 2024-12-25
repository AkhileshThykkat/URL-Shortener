const authenticateJWT = require("../middlewares/checkToken");
const { validateCreateShortUrl } = require("../validators/url");
const { url_controller } = require("../controllers");

const router = require("express").Router();

router.post(
  "/api/shorten",
  authenticateJWT,
  validateCreateShortUrl,
  url_controller.shortenUrl
);

router.get("/api/shorten/:alias", url_controller.redirectUrl);
module.exports = router;
