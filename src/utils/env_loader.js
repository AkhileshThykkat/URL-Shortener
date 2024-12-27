const dotenv = require("dotenv");

dotenv.config();

const envVariables = {
  PORT: parseInt(process.env.PORT, 10),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_URL: process.env.GOOGLE_AUTH_PROVIDER_URL,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  REDIS_URL: process.env.REDIS_URL,
};

// envVariables contains all the environment variables required for the application.
// These variables are loaded from the .env file using the dotenv package.
module.exports = envVariables;
