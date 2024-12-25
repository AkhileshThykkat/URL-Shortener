const hash = require("crypto").createHash("sha256");

function generateRandomAlias() {
  return Math.random().toString(36).substring(2, 8);
}

function detectDevice(userAgent) {
  if (!userAgent) {
    return "Unknown";
  }

  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile")) {
    return "Mobile";
  } else if (ua.includes("tablet")) {
    return "Tablet";
  } else {
    return "Desktop";
  }
}

function detectOS(userAgent) {
  if (!userAgent) {
    return "Unknown";
  }

  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) {
    return "Windows";
  } else if (ua.includes("mac")) {
    return "Mac";
  } else if (ua.includes("linux")) {
    return "Linux";
  } else {
    return "Unknown";
  }
}
function generateVisitorId(ip_address, userAgent) {
  const crypto = require("crypto");
  const hash = crypto.createHash("sha256");
  hash.update(ip_address + userAgent);
  return hash.digest("hex");
}

const urlTracking = {
  detectDevice,
  detectOS,
  generateVisitorId,
};
module.exports = {
  urlTracking,
  generateRandomAlias,
};
