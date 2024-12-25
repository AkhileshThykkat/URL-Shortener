const { Op } = require("sequelize");
const sequelize = require("../config/db");
const {
  ClickEvent,
  DailyStat,
  DeviceStat,
  OsStat,
  URL,
  User,
} = require("../models");
const moment = require("moment");
const express = require("express");
const router = express.Router();

const authenticateJWT = require("../middlewares/checkToken");

// async function getOverallAnalytics(userId) {
//   // Retrieve all URLs created by the user
//   const urls = await URL.findAll({
//     where: { userId }, // Filter URLs by the userId
//   });

//   // If no URLs are found, return empty data
//   if (urls.length === 0) {
//     return {
//       totalUrls: 0,
//       totalClicks: 0,
//       uniqueClicks: 0,
//       clicksByDate: [],
//       osType: [],
//       deviceType: [],
//     };
//   }

//   // Get total and unique clicks for all URLs
//   const clickEvents = await ClickEvent.findAll({
//     where: {
//       urlId: { [Op.in]: urls.map((url) => url.id) },
//     },
//   });

//   // Get unique clicks (distinct visitorId)
//   const uniqueClicks = await ClickEvent.count({
//     distinct: true,
//     where: {
//       urlId: { [Op.in]: urls.map((url) => url.id) },
//     },
//     attributes: ["visitorId"],
//   });

//   // Get daily clicks by date for all URLs
//   const clicksByDate = await DailyStat.findAll({
//     where: {
//       urlId: { [Op.in]: urls.map((url) => url.id) },
//     },
//     attributes: [
//       "date",
//       [sequelize.fn("sum", sequelize.col("totalClicks")), "totalClicks"],
//     ],
//     group: ["date"],
//     order: [["date", "ASC"]],
//   });

//   // Get OS type statistics
//   const osType = await OsStat.findAll({
//     where: {
//       urlId: { [Op.in]: urls.map((url) => url.id) },
//     },
//   });

//   // Get device type statistics
//   const deviceType = await DeviceStat.findAll({
//     where: {
//       urlId: { [Op.in]: urls.map((url) => url.id) },
//     },
//   });

//   // Return the aggregated data
//   return {
//     totalUrls: urls.length,
//     totalClicks: clickEvents.length,
//     uniqueClicks,
//     clicksByDate,
//     osType,
//     deviceType,
//   };
// }

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

router.get("/api/analytics/overall", authenticateJWT, async (req, res) => {
  try {
    // Get user by email from request (assuming email is in req.user['email'])
    const user = await User.findOne({ where: { email: req.user["email"] } });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the overall analytics for the user
    const analytics = await getOverallAnalytics(user.id);
    console.log(analytics);

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// Utility function to get last 7 days dates
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(moment().subtract(i, "days").format("YYYY-MM-DD"));
  }
  return days;
};

// Get Analytics for a specific URL alias
router.get("/api/analytics/:alias", authenticateJWT, async (req, res) => {
  try {
    const { alias } = req.params;
    // console.log(alias);

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

    // Return the response in the required format
    return res.json({
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
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/api/analytics/topic/:topic", authenticateJWT, async (req, res) => {
  const { topic } = req.params;

  try {
    // Fetch URLs associated with the topic
    const urls = await URL.findAll({
      where: { topic }, // Assuming topic is a column in the URLs table
      attributes: ["id", "customAlias"],
    });

    // Get total clicks and unique clicks across all URLs in the topic
    const totalClicks = await ClickEvent.count({
      where: { urlId: { [Op.in]: urls.map((url) => url.id) } },
    });

    const uniqueClicks = await ClickEvent.count({
      distinct: true,
      where: { urlId: { [Op.in]: urls.map((url) => url.id) } },
      group: "visitorId",
    });

    // Get daily stats (click counts by date)
    const clicksByDate = await DailyStat.findAll({
      where: { urlId: { [Op.in]: urls.map((url) => url.id) } },
      attributes: [
        "date",
        [sequelize.fn("SUM", sequelize.col("totalClicks")), "totalClicks"],
      ],
      group: "date",
    });

    // Get analytics for each URL
    const urlAnalytics = await Promise.all(
      urls.map(async (url) => {
        const totalClicksForUrl = await ClickEvent.count({
          where: { urlId: url.id },
        });

        const uniqueClicksForUrl = await ClickEvent.count({
          distinct: true,
          where: { urlId: url.id },
          group: "visitorId",
        });

        return {
          shortUrl: `http://localhost:3000/api/shorten/${url.customAlias}`,
          totalClicks: totalClicksForUrl,
          uniqueClicks: uniqueClicksForUrl,
        };
      })
    );

    // Construct the final response
    const response = {
      totalClicks,
      uniqueClicks,
      clicksByDate,
      urls: urlAnalytics,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching analytics" });
  }
});

// GET endpoint for overall analytics

module.exports = router;
