const rateLimit = require("express-rate-limit");

const shortUrlRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2,
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message:
        "You have exceeded the maximum number of requests. Please try again later.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const analyticsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      error: "Rate limit exceeded",
      message:
        "You have exceeded the maximum number of requests. Please try again later.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const rateLimiter = {
  shortUrlRateLimiter,
  analyticsRateLimiter,
};

module.exports = { rateLimiter };
