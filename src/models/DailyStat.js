const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DailyStat = sequelize.define(
  "DailyStat",
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    uniqueClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "daily_stats",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["urlId", "date"],
      },
    ],
  }
);

module.exports = DailyStat;
