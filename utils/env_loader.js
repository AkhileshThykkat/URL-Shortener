const dotenv = require("dotenv");

dotenv.config();

const envVariables = {
  PORT: process.env.PORT,
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_URL: process.env.GOOGLE_AUTH_PROVIDER_URL,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = envVariables;
