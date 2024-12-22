const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust path based on your project structure

const ClickAnalytics = sequelize.define(
  "ClickAnalytics",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    urlId: {
      type: DataTypes.UUID,
      references: {
        model: "URLs",
        key: "id",
      },
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    osType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deviceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geoLocation: {
      type: DataTypes.JSONB, // Store geolocation as JSON
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      { fields: ["urlId"] },
      { fields: ["timestamp"] },
      { fields: ["osType"] },
      { fields: ["deviceType"] },
    ],
  }
);

module.exports = ClickAnalytics;
