 
  const Redis = require("ioredis");
  require("dotenv").config();
  
  const redisConnection = new Redis({
    port: process.env.redis_port,
    host: process.env.redis_host,
    password: process.env.redis_pass,
  }, {
    maxRetriesPerRequest: null
  });
  
  const fetchTokenFromRedis = async (email) => {
    try {
      const token = await redisConnection.get(email);
      return token;
    } catch (error) {
      console.error(`Failed to fetch token from Redis for email ${email}:`, error.message);
      throw new Error(`Unable to fetch token from Redis for email ${email}.`);
    }
  };
  
  module.exports = {
    redisConnection,
    fetchTokenFromRedis
  };
  