import { createClient } from 'redis'
import { env } from './env.js'

const RETRY_COOLDOWN_MS = 30_000

let client
let connectPromise
let lastFailureAt = 0
let hasWarned = false

function warnOnce(error) {
  if (hasWarned) return
  hasWarned = true
  console.warn(`Redis unavailable; falling back without Redis. ${error.message}`)
}

export async function getRedisClient() {
  if (!env.redisUrl) return null
  if (client?.isReady) return client
  if (Date.now() - lastFailureAt < RETRY_COOLDOWN_MS) return null

  if (!client) {
    client = createClient({
      url: env.redisUrl,
      socket: {
        reconnectStrategy: false
      }
    })

    client.on('error', warnOnce)
  }

  if (!connectPromise) {
    connectPromise = client.connect()
      .catch((error) => {
        lastFailureAt = Date.now()
        warnOnce(error)
        return null
      })
      .finally(() => {
        connectPromise = null
      })
  }

  await connectPromise
  return client.isReady ? client : null
}

export async function shutdownRedis() {
  if (!client?.isOpen) return
  await client.quit()
}
