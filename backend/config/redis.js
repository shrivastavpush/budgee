// Optional shared store for rate limiting across instances.
// Enabled only when REDIS_URL is set; requires `redis` and `rate-limit-redis`.
let client = null

const getRedisClient = () => {
  if (!process.env.REDIS_URL) return null
  if (client) return client

  const { createClient } = require('redis')
  client = createClient({ url: process.env.REDIS_URL })
  client.on('error', (err) => console.error('Redis error:', err.message))
  client.connect().catch((err) => console.error('Redis connect:', err.message))
  return client
}

// Returns a rate-limit store factory, or undefined to use the in-memory default.
const createLimiterStore = (prefix) => {
  const redis = getRedisClient()
  if (!redis) return undefined

  const { RedisStore } = require('rate-limit-redis')
  return new RedisStore({
    prefix: `rl:${prefix}:`,
    sendCommand: (...args) => redis.sendCommand(args),
  })
}

const closeRedis = async () => {
  if (client?.isOpen) await client.quit()
}

module.exports = { createLimiterStore, closeRedis }
