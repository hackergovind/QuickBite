import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'
import { RedisRateLimitStore } from './redisRateLimitStore.js'

function createLimiter({ max, message, prefix }) {
  const options = {
    windowMs: env.rateLimitWindowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message,
    passOnStoreError: true
  }

  if (env.redisUrl) {
    options.store = new RedisRateLimitStore(prefix)
  }

  return rateLimit(options)
}

export const apiLimiter = createLimiter({
  max: env.rateLimitMax,
  message: { message: 'Too many requests. Please try again soon.' },
  prefix: 'rl:api'
})

export const authLimiter = createLimiter({
  max: env.authRateLimitMax,
  message: { message: 'Too many authentication attempts. Please try again soon.' },
  prefix: 'rl:auth'
})
