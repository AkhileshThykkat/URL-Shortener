const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ClickEvent = sequelize.define(
  "ClickEvent",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    urlId: {
      type: DataTypes.UUID,
      references: {
        model: "URLs", // Name of the table
        key: "id",
      },
      allowNull: false,
    },
    visitorId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    osType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    deviceType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    clickedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ["urlId", "clickedAt"],
      },
      {
        fields: ["visitorId"],
      },
    ],
    timestamps: false,
  }
);

module.exports = ClickEvent;
