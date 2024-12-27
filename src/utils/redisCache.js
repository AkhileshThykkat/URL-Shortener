const { createClient } = require("redis");

const envVariables = require("../utils/env_loader");

class RedisCache {
  constructor() {
    this.client = createClient({
      url: envVariables.REDIS_URL,
    });

    // Attach event listeners
    this.client.on("connect", () => console.log("Redis client connected"));
    this.client.on("error", (err) => console.error("Redis client error:", err));

    // Connect to Redis
    this.client.connect().catch((err) => {
      console.error("Error connecting to Redis:", err);
    });
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error fetching from cache:", error);
      return null;
    }
  }

  async set(key, value, expiration = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), { EX: expiration });
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }

  async remove(key) {
    try {
      await this.client.del(key);
      console.log(`Key ${key} removed from cache`);
    } catch (error) {
      console.error("Error removing from cache:", error);
    }
  }

  async close() {
    try {
      await this.client.quit();
      console.log("Redis client connection closed.");
    } catch (error) {
      console.error("Error closing Redis client:", error);
    }
  }
}

module.exports = new RedisCache();
