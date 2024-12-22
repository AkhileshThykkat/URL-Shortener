const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust path based on your project structure

const UserAnalytics = sequelize.define(
  "UserAnalytics",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    totalClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    activeUrls: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [{ fields: ["userId"] }, { fields: ["lastActive"] }],
  }
);

module.exports = UserAnalytics;
