const sequelize = require("../config/db");
const User = require("./User");
const URL = require("./URL");
const ClickAnalytics = require("./ClickAnalytics");
const UserAnalytics = require("./UserAnalytics");

// Define Relationships
User.hasOne(UserAnalytics, { foreignKey: "userId" });
UserAnalytics.belongsTo(User, { foreignKey: "userId" });

User.hasMany(URL, { foreignKey: "userId" });
URL.belongsTo(User, { foreignKey: "userId" });

URL.hasMany(ClickAnalytics, { foreignKey: "urlId" });
ClickAnalytics.belongsTo(URL, { foreignKey: "urlId" });

module.exports = {
  sequelize,
  User,
  URL,
  ClickAnalytics,
  UserAnalytics,
};
