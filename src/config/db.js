const { Sequelize } = require("sequelize");

const envVariables = require("../utils/env_loader");

const sequelize = new Sequelize(
  envVariables.DB_NAME,
  envVariables.DB_USER,
  envVariables.DB_PASSWORD,
  {
    host: envVariables.DB_HOST,
    dialect: "postgres", // Change this to your preferred DBMS (e.g., mysql, sqlite)
    logging: false, // Disable logging for cleaner output
  }
);

module.exports = sequelize;
