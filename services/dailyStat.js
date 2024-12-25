const { DailyStat } = require("../models");

async function upsertDailyStat(date, data) {
  try {
    const [stat, created] = await DailyStat.findOrCreate({
      where: { date: date },
      defaults: data,
    });

    if (!created) {
      await stat.update(data);
    }

    return stat;
  } catch (error) {
    console.error("Error upserting daily stat:", error);
    throw error;
  }
}
async function findDailyStatByUrlAndDate(urlId, date) {
  try {
    const stat = await DailyStat.findOne({
      where: { urlId: urlId, date: date },
    });
    if (!stat) {
      return null;
    }
    return stat;
  } catch (error) {
    console.error("Error finding daily stat by URL and date:", error);
    throw error;
  }
}

const dailyStat_service = {
  upsertDailyStat,
  findDailyStatByUrlAndDate,
};

module.exports = {
  dailyStat_service,
};
