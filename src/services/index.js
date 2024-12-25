const { user_service } = require("./user");
const { url_service } = require("./url");
const { clickEvent_service } = require("./clickEvent");
const { dailyStat_service } = require("./dailyStat");
const { osStat_service } = require("./osStat");
const { deviceStat_service } = require("./deviceStat");

module.exports = {
  user_service,
  url_service,
  clickEvent_service,
  dailyStat_service,
  osStat_service,
  deviceStat_service,
};
