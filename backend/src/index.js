import app from './app.js'
import { assertEnv, env } from './config/env.js'
import { shutdownRedis } from './config/redis.js'
import { pool } from './db/pool.js'

assertEnv()

const server = app.listen(env.port, () => {
  console.log(`API server listening on http://localhost:${env.port}`)
})

async function shutdown() {
  server.close(async () => {
    await pool.end()
    await shutdownRedis()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
