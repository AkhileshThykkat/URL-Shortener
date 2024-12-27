const ClickEvent = require("../models/ClickEvent");

const createClickEvent = async (clickEventData) => {
  try {
    const clickEvent = new ClickEvent(clickEventData);
    await clickEvent.save();
    return clickEvent;
  } catch (error) {
    console.error("Error creating click event:", error);
    throw error;
  }
};
const isUniqueClick = async (urlId, visitorId) => {
  try {
    const existingClickEvent = await ClickEvent.findOne({
      where: { urlId, visitorId },
    });
    return !existingClickEvent;
  } catch (error) {
    console.error("Error checking unique click event:", error);
    throw error;
  }
};
const clickEvent_service = {
  createClickEvent,
  isUniqueClick,
};
module.exports = {
  clickEvent_service,
};
