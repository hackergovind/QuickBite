import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { query } from '../db/pool.js'

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' })
    }

    const payload = jwt.verify(token, env.jwtSecret)
    const { rows } = await query(
      `SELECT id, name, email, role, avatar_url, phone, address, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [payload.sub]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    req.user = rows[0]
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired authentication token' })
    }

    next(error)
  }
}
