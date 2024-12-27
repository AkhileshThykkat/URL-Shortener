const express = require("express");
const router = express.Router();

const authenticateJWT = require("../middlewares/checkToken");
const { rateLimiter } = require("../middlewares/rateLimiter");
const { analytics_controller } = require("../controllers");

router.get(
  "/api/analytics/overall",
  authenticateJWT,
  rateLimiter.analyticsRateLimiter,
  analytics_controller.overallAnalytics
);
router.get(
  "/api/analytics/:alias",
  authenticateJWT,
  rateLimiter.analyticsRateLimiter,
  analytics_controller.analyticsByAlias
);
router.get(
  "/api/analytics/topic/:topic",
  authenticateJWT,
  rateLimiter.analyticsRateLimiter,
  analytics_controller.analyticsByTopic
);

module.exports = router;
