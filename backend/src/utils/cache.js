import { env } from '../config/env.js'
import { getRedisClient } from '../config/redis.js'

export async function getJsonCache(key) {
  const redis = await getRedisClient()
  if (!redis) return null

  const cached = await redis.get(key)
  if (!cached) return null

  try {
    return JSON.parse(cached)
  } catch {
    await redis.del(key)
    return null
  }
}

export async function setJsonCache(key, value, ttlSeconds = env.cacheTtlSeconds) {
  const redis = await getRedisClient()
  if (!redis) return

  await redis.setEx(key, ttlSeconds, JSON.stringify(value))
}

export async function withJsonCache(key, loader, ttlSeconds) {
  const cached = await getJsonCache(key)
  if (cached) return { data: cached, cacheStatus: 'hit' }

  const data = await loader()
  await setJsonCache(key, data, ttlSeconds)
  return { data, cacheStatus: 'miss' }
}
