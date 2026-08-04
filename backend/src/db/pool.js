import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
})

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL error', error)
})

export async function query(text, params) {
  const result = await pool.query(text, params)
  return result
}
