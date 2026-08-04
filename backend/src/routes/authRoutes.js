import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { sanitizeUser, signAccessToken, USER_SELECT } from '../utils/auth.js'

const router = Router()
const allowedSignupRoles = new Set(['customer', 'owner'])

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateSignup({ name, email, password, role }) {
  if (!name?.trim()) return 'Name is required'
  if (!email?.trim() || !isValidEmail(email)) return 'A valid email is required'
  if (!password || password.length < 6) return 'Password must be at least 6 characters'
  if (role && !allowedSignupRoles.has(role)) return 'Invalid account role'
  return null
}

function validateLogin({ email, password }) {
  if (!email?.trim() || !isValidEmail(email)) return 'A valid email is required'
  if (!password) return 'Password is required'
  return null
}

router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const validationError = validateSignup(req.body)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const name = req.body.name.trim()
    const email = req.body.email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(req.body.password, 12)
    const role = req.body.role || 'customer'

    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING ${USER_SELECT}`,
      [name, email, passwordHash, role]
    )

    const user = rows[0]
    const token = signAccessToken(user)

    res.status(201).json({ token, user: sanitizeUser(user) })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    next(error)
  }
})

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const validationError = validateLogin(req.body)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const email = req.body.email.trim().toLowerCase()
    const { rows } = await query(
      `SELECT ${USER_SELECT}, password_hash
       FROM users
       WHERE email = $1`,
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = rows[0]
    const passwordMatches = await bcrypt.compare(req.body.password, user.password_hash)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id])

    const token = signAccessToken(user)
    res.json({ token, user: sanitizeUser(user) })
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) })
})

router.post('/logout', requireAuth, (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
