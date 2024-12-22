const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust path based on your project structure

const URL = sequelize.define(
  "URL",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    longUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customAlias: {
      type: DataTypes.STRING,
      unique: true,
    },
    topic: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    clickCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    indexes: [
      // { fields: ["shortUrl"] },
      { fields: ["customAlias"] },
      { fields: ["topic"] },
    ],
  }
);

module.exports = URL;
