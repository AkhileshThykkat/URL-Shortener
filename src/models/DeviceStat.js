const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DeviceStat = sequelize.define(
  "DeviceStat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    deviceName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    uniqueClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    uniqueUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["urlId", "deviceName"],
      },
    ],
  }
);

module.exports = DeviceStat;
