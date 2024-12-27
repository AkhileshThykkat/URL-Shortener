const express = require("express");
const router = express.Router();

const authenticateJWT = require("../middlewares/checkToken");
const { analytics_controller } = require("../controllers");

router.get(
  "/api/analytics/overall",
  authenticateJWT,
  analytics_controller.overallAnalytics
);
router.get(
  "/api/analytics/:alias",
  authenticateJWT,
  analytics_controller.analyticsByAlias
);
router.get(
  "/api/analytics/topic/:topic",
  authenticateJWT,
  analytics_controller.analyticsByTopic
);

module.exports = router;
