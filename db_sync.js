const {
  sequelize,
  User,
  URL,
  ClickAnalytics,
  UserAnalytics,
} = require("./models");

(async () => {
  try {
    const result = await sequelize.sync({ force: false });
    if (result) {
      console.log("Database synced successfully.");
    } else {
      console.log("No changes made to the database schema.");
    }
  } catch (error) {
    console.error("Failed to sync database:", error);
  } finally {
    await sequelize.close();
  }
})();
