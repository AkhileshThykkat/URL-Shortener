const sequelize = require("../config/db");
const User = require("./User");
const URL = require("./URL");
const ClickEvent = require("./ClickEvent");
const DailyStat = require("./DailyStat");
const OsStat = require("./OsStat");
const DeviceStat = require("./DeviceStat");

User.hasMany(URL, { foreignKey: "userId" });
URL.belongsTo(User, { foreignKey: "userId" });

URL.hasMany(ClickEvent, { foreignKey: "urlId" });
ClickEvent.belongsTo(URL, { foreignKey: "urlId" });

URL.hasMany(DailyStat, { foreignKey: "urlId" });
DailyStat.belongsTo(URL, { foreignKey: "urlId" });

URL.hasMany(OsStat, { foreignKey: "urlId" });
OsStat.belongsTo(URL, { foreignKey: "urlId" });

URL.hasMany(DeviceStat, { foreignKey: "urlId" });
DeviceStat.belongsTo(URL, { foreignKey: "urlId" });

module.exports = {
  sequelize,
  User,
  URL,
  ClickEvent,
  DailyStat,
  OsStat,
  DeviceStat,
};
