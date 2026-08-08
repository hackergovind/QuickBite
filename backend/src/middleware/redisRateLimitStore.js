import { getRedisClient } from '../config/redis.js'

export class RedisRateLimitStore {
  constructor(prefix) {
    this.prefix = prefix
    this.windowMs = 60_000
  }

  init(options) {
    this.windowMs = options.windowMs
  }

  async increment(key) {
    const redis = await getRedisClient()
    if (!redis) throw new Error('Redis rate limit store is unavailable')

    const redisKey = `${this.prefix}:${key}`
    const totalHits = await redis.incr(redisKey)

    if (totalHits === 1) {
      await redis.pExpire(redisKey, this.windowMs)
    }

    let ttl = await redis.pTTL(redisKey)
    if (ttl < 0) {
      await redis.pExpire(redisKey, this.windowMs)
      ttl = this.windowMs
    }

    return {
      totalHits,
      resetTime: new Date(Date.now() + ttl)
    }
  }

  async decrement(key) {
    const redis = await getRedisClient()
    if (!redis) return

    const redisKey = `${this.prefix}:${key}`
    const current = await redis.decr(redisKey)
    if (current <= 0) await redis.del(redisKey)
  }

  async resetKey(key) {
    const redis = await getRedisClient()
    if (!redis) return

    await redis.del(`${this.prefix}:${key}`)
  }
}
