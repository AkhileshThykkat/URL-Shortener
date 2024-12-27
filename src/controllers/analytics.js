const { Op } = require("sequelize");
const sequelize = require("../config/db");
const moment = require("moment");
const {
  ClickEvent,
  DailyStat,
  DeviceStat,
  OsStat,
  URL,
  User,
} = require("../models");
const { getLast7Days } = require("../utils/lib");
const redisClient = require("../utils/redisCache");
const envVariables = require("../utils/env_loader");

async function getOverallAnalytics(userId) {
  try {
    const urls = await URL.findAll({ where: { userId } });

    if (urls.length === 0) {
      return {
        totalUrls: 0,
        totalClicks: 0,
        uniqueClicks: 0,
        clicksByDate: [],
        osType: [],
        deviceType: [],
      };
    }

    const urlIds = urls.map((url) => url.id);

    const [totalClicks, uniqueClicks, clicksByDate, osType, deviceType] =
      await Promise.all([
        ClickEvent.count({ where: { urlId: { [Op.in]: urlIds } } }),
        ClickEvent.count({
          distinct: true,
          col: "visitorId",
          where: { urlId: { [Op.in]: urlIds } },
        }),
        DailyStat.findAll({
          where: { urlId: { [Op.in]: urlIds } },
          attributes: [
            "date",
            [sequelize.fn("sum", sequelize.col("totalClicks")), "totalClicks"],
          ],
          group: ["date"],
          order: [["date", "ASC"]],
        }),
        OsStat.findAll({ where: { urlId: { [Op.in]: urlIds } } }),
        DeviceStat.findAll({ where: { urlId: { [Op.in]: urlIds } } }),
      ]);

    return {
      totalUrls: urls.length,
      totalClicks,
      uniqueClicks,
      clicksByDate,
      osType,
      deviceType,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw new Error("Unable to fetch analytics. Please try again later.");
  }
}

async function overallAnalytics(req, res) {
  try {
    // Get user by email from request (assuming email is in req.user['email'])
    const user = await User.findOne({ where: { email: req.user["email"] } });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the overall analytics for the user
    const analytics = await getOverallAnalytics(user.id);
    //   console.log(analytics);
    const cacheKey = `analyticsOverall:${user.id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    await redisClient.set(cacheKey, JSON.stringify(analytics));

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
async function analyticsByAlias(req, res) {
  try {
    const { alias } = req.params;
    if (!alias) {
      return res.status(400).json({ error: "Alias is required" });
    }

    const cacheKey = `analyticsByAlias:${alias}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Find the URL by alias (assuming alias is part of the URLs table)
    const url = await URL.findOne({ where: { customAlias: alias } });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Get total clicks and unique clicks from ClickEvent model
    const totalClicks = await ClickEvent.count({
      where: { urlId: url.id },
    });

    const uniqueClicks = await ClickEvent.count({
      distinct: true,
      where: { urlId: url.id },
      col: "visitorId",
    });

    // Get clicks by date (for the last 7 days)
    const last7Days = getLast7Days();
    const clicksByDate = await ClickEvent.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("clickedAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "clickCount"],
      ],
      where: {
        urlId: url.id,
        clickedAt: {
          [Op.gte]: moment().subtract(7, "days").toDate(),
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("clickedAt"))],
      raw: true,
    });

    // Format the clicksByDate to match the last 7 days
    const clicksByDateFormatted = last7Days.map((date) => {
      const clickData = clicksByDate.find((item) => item.date === date);
      return {
        date,
        clickCount: clickData ? parseInt(clickData.clickCount) : 0,
      };
    });

    // Get OS stats from OsStat model
    const osStats = await OsStat.findAll({
      where: { urlId: url.id },
      attributes: ["osName", "uniqueClicks", "uniqueUsers"],
    });

    // Get Device stats from DeviceStat model
    const deviceStats = await DeviceStat.findAll({
      where: { urlId: url.id },
      attributes: ["deviceName", "uniqueClicks", "uniqueUsers"],
    });

    const analytics = {
      totalClicks,
      uniqueClicks,
      clicksByDate: clicksByDateFormatted,
      osType: osStats.map((os) => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers,
      })),
      deviceType: deviceStats.map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers,
      })),
    };

    // await redisClient.set(cacheKey, JSON.stringify(analytics), "EX", 3600);
    await redisClient.set(cacheKey, JSON.stringify(analytics));

    return res.json(analytics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function analyticsByTopic(req, res) {
  try {
    const { topic } = req.params;
    const cacheKey = `analyticsByTopic:${topic}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    // Find the URL by alias (assuming alias is part of the URLs table)
    const urls = await URL.findAll({
      where: { topic },
    });
    if (!urls) {
      return res.status(404).json({ error: "URLs not found" });
    }
    const urlIds = urls.map((url) => url.id);

    const [totalClicks, uniqueUsers, clicksByDate, osStats, deviceStats] =
      await Promise.all([
        ClickEvent.count({ where: { urlId: { [Op.in]: urlIds } } }),
        ClickEvent.count({
          distinct: true,
          col: "visitorId",
          where: { urlId: { [Op.in]: urlIds } },
        }),
        DailyStat.findAll({
          where: { urlId: { [Op.in]: urlIds } },
          attributes: [
            "date",
            [sequelize.fn("sum", sequelize.col("totalClicks")), "totalClicks"],
          ],
          group: ["date"],
          order: [["date", "ASC"]],
        }),
        OsStat.findAll({ where: { urlId: { [Op.in]: urlIds } } }),
        DeviceStat.findAll({ where: { urlId: { [Op.in]: urlIds } } }),
      ]);

    const clicksByDateFormatted = clicksByDate.map((item) => ({
      date: item.date,
      totalClicks: item.totalClicks,
    }));

    const urlsData = await Promise.all(
      urls.map(async (url) => {
        const urlTotalClicks = await ClickEvent.count({
          where: { urlId: url.id },
        });
        const urlUniqueUsers = await ClickEvent.count({
          distinct: true,
          col: "visitorId",
          where: { urlId: url.id },
        });

        return {
          shortUrl: `${envVariables.API_BASE_URL}/${url.customAlias}`,
          totalClicks: urlTotalClicks,
          uniqueUsers: urlUniqueUsers,
        };
      })
    );

    const analytics = {
      totalClicks,
      uniqueUsers,
      clicksByDate: clicksByDateFormatted,
      osType: osStats.map((os) => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers,
      })),
      deviceType: deviceStats.map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers,
      })),
      urls: urlsData,
    };

    await redisClient.set(cacheKey, JSON.stringify(analytics));

    // Return the response in the required format
    return res.json(analytics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const analytics_controller = {
  overallAnalytics,
  analyticsByAlias,
  analyticsByTopic,
};
module.exports = {
  analytics_controller,
};
