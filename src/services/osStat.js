const { OsStat } = require("../models");

async function upsertOsStat(osType, data) {
  try {
    const { urlId, osName, uniqueClicks, uniqueUsers, lastUpdated } = data;
    const [osStat, created] = await OsStat.findOrCreate({
      where: { osName: osType, urlId },
      defaults: {
        totalCount: 1,
        osName,
        uniqueClicks: 1,
        uniqueUsers: 1,
        lastUpdated,
      },
    });

    if (!created) {
      osStat.totalCount += 1;
      osStat.uniqueClicks = uniqueClicks;
      osStat.uniqueUsers = uniqueUsers;
      osStat.lastUpdated = lastUpdated;
      await osStat.save();
    }

    return osStat;
  } catch (error) {
    console.error("Error upserting OS stat:", error);
    throw error;
  }
}

const osStat_service = { upsertOsStat };
module.exports = { osStat_service };
