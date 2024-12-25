const { check } = require("express-validator");

const validateCreateShortUrl = [
  check("longURL").isURL().withMessage("Please enter a valid URL"),
  check("customAlias")
    .optional()
    .isAlphanumeric()
    .withMessage("Please enter a valid custom alias"),
  check("topic")
    .optional()
    .isString()
    .withMessage("Please enter a valid topic"),
];

module.exports = {
  validateCreateShortUrl,
};
validateCreateShortUrl;
