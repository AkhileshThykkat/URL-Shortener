const { generateRandomAlias } = require("../utils/lib");

const { validateCreateShortUrl } = require("../validators/url");
const { url_service, user_service } = require("../services");

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
      shortUrl: `http://localhost:3000/api/shorten/${alias}`,
      createdAt: shortUrl.createdAt,
    });
  }
  return res.status(500).send("Internal server error");
}

async function redirectUrl(req, res) {
  const user = req.user;
  const alias = req.params.alias;
  const url = await url_service.findByAlias(alias);
  if (!url) {
    return res.status(404).send("URL not found");
  }
  await url_service.incrementClickCount(url.id);
  return res.redirect(302, url.longUrl);
}

const url_controller = {
  shortenUrl,
  redirectUrl,
};
module.exports = {
  url_controller,
};
