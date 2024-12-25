const URL = require("../models/URL");

async function createShortUrl(urlData) {
  try {
    const url = new URL(urlData);
    await url.save();
    return url;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating short URL");
  }
}

async function findByAlias(alias) {
  try {
    const url = await URL.findOne({ where: { customAlias: alias } });
    if (!url) {
      return null;
    }
    return url;
  } catch (error) {
    console.log(error);
    throw new Error("Error finding short URL by alias");
  }
}

async function incrementClickCount(id) {
  try {
    const url = await URL.findOne({ where: { id } });
    if (!url) {
      throw new Error("URL not found");
    }
    url.clickCount += 1;
    await url.save();
    return url;
  } catch (error) {
    console.log(error);
    throw new Error("Error incrementing click count");
  }
}
const url_service = {
  createShortUrl,
  findByAlias,
  incrementClickCount,
};

module.exports = {
  url_service,
};
