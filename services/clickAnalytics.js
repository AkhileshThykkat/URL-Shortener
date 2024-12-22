const { ClickAnalytics } = require("./models");

async function createClickAnalytics(clickData) {
  try {
    const click = new ClickAnalytics(clickData);
    await click.save();
    return click;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating click analytics");
  }
}
