const { DeviceStat } = require("../models");

async function upsertDeviceStat(deviceType, urlId) {
  try {
    const [deviceStat, created] = await DeviceStat.findOrCreate({
      where: { deviceName: deviceType, urlId },
      defaults: {
        totalCount: 1,
        uniqueClicks: 1,
        uniqueUsers: 1,
        lastUpdated: new Date(),
      },
    });

    if (!created) {
      deviceStat.totalCount += 1;
      await deviceStat.save();
    }

    return deviceStat;
  } catch (error) {
    console.error("Error upserting device stat:", error);
    throw error;
  }
}

const deviceStat_service = { upsertDeviceStat };
module.exports = { deviceStat_service };
