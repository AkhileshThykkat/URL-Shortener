const { generateRandomAlias } = require("../utils/lib");
const {
  url_service,
  user_service,
  clickEvent_service,
  dailyStat_service,
  deviceStat_service,
  osStat_service,
} = require("../services");
const { urlTracking } = require("../utils/lib");
const redisCache = require("../utils/redisCache");
const envVariables = require("../utils/env_loader");

async function shortenUrl(req, res) {
  const user = req.user;
  const user_detail = await user_service.findUserByEmail(user.email);
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }
  const { longUrl, customAlias = null, topic = null } = req.body;

  const alias = customAlias || generateRandomAlias();
  const urlTopic = topic || "default";

  // Validate the input

  // Check if the alias is already taken
  const url = await url_service.findByAlias(alias);
  if (url) {
    return res.status(400).send("Alias is already taken");
  }
  const shortUrl = await url_service.createShortUrl({
    longUrl,
    customAlias: alias,
    topic: urlTopic,
    userId: user_detail.id,
  });
  if (shortUrl) {
    return res.status(201).send({
      shortUrl: `${envVariables.API_BASE_URL}/api/shorten/${alias}`,
      createdAt: shortUrl.createdAt,
    });
  }
  return res.status(500).send("Internal server error");
}

async function redirectUrl(req, res) {
  // const user = req.user;
  // add cache layer for the long url with the alias

  const userAgent = req.headers["user-agent"];
  const ip_address = req.ip;
  const referer = req.headers["referer"] || null;

  const alias = req.params.alias;

  // Check cache first
  let url = await redisCache.get(alias);
  if (!url) {
    url = await url_service.findByAlias(alias);
    if (!url) {
      return res.status(404).send("URL not found");
    }
    // Save to cache
    await redisCache.set(alias, url);
  }

  const deviceType = urlTracking.detectDevice(userAgent);
  const osType = urlTracking.detectOS(userAgent);
  const visitorId = urlTracking.generateVisitorId(ip_address, userAgent);
  // Create a click event
  await clickEvent_service.createClickEvent({
    urlId: url.id,
    visitorId,
    osType,
    deviceType,
    clickedAt: new Date(),
    ipAddress: ip_address,
    userAgent,
    referer,
  });
  // Update Daily Stat
  const today = new Date().toISOString().split("T")[0];

  const dailyStat = await dailyStat_service.findDailyStatByUrlAndDate(
    url.id,
    today
  );
  const isUniqueClick = await clickEvent_service.isUniqueClick(
    url.id,
    visitorId
  );

  await dailyStat_service.upsertDailyStat(today, {
    urlId: url.id,
    date: today,
    totalClicks: dailyStat ? dailyStat.totalClicks + 1 : 1,
    uniqueClicks: dailyStat
      ? dailyStat.uniqueClicks + (isUniqueClick ? 1 : 0)
      : isUniqueClick
      ? 1
      : 0,
  });

  // Update device stats
  await deviceStat_service.upsertDeviceStat(deviceType, url.id, {
    urlId: url.id,
    deviceName: deviceType,
    uniqueClicks: dailyStat
      ? dailyStat.uniqueClicks + (isUniqueClick ? 1 : 0)
      : isUniqueClick
      ? 1
      : 0,
    uniqueUsers: dailyStat
      ? dailyStat.uniqueUsers + (isUniqueClick ? 1 : 0)
      : isUniqueClick
      ? 1
      : 0,
    lastUpdated: new Date(),
  });

  // Update the os stats
  await osStat_service.upsertOsStat(osType, {
    urlId: url.id,
    osName: osType,
    uniqueClicks: dailyStat
      ? !isNaN(dailyStat.uniqueClicks)
        ? dailyStat.uniqueClicks + (isUniqueClick ? 1 : 0)
        : 0
      : isUniqueClick
      ? 1
      : 0,
    uniqueUsers: dailyStat
      ? !isNaN(dailyStat.uniqueUsers)
        ? dailyStat.uniqueUsers + (isUniqueClick ? 1 : 0)
        : 0
      : isUniqueClick
      ? 1
      : 0,
    lastUpdated: new Date(),
  });

  await url_service.incrementClickCount(url.id);
  // remove the cache for the url for daily stat, os stat, device stat
  const cacheKeys = [
    `analyticsByTopic:${url.topic}`,
    `analyticsByAlias:${url.customAlias}`,
    `analyticsOverall:${url.userId}`,
  ];
  await redisCache.remove([...cacheKeys]);
  return res.redirect(302, url.longUrl);
}

const url_controller = {
  shortenUrl,
  redirectUrl,
};
module.exports = {
  url_controller,
};
