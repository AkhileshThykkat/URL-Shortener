const User = require("../models/User");

async function saveUser(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error saving user: " + error.message);
  }
}

async function checkUserExists(email) {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error("Error checking user existence: " + error.message);
  }
}

async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return user;
    }
    return null;
  } catch (error) {
    throw new Error("Error finding user by email: " + error.message);
  }
}

const user_service = {
  saveUser,
  checkUserExists,
  findUserByEmail,
};

module.exports = {
  user_service,
};
