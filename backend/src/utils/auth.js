import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const USER_SELECT = `
  id,
  name,
  email,
  role,
  avatar_url,
  phone,
  address,
  created_at,
  updated_at
`

export { USER_SELECT }

export function signAccessToken(user) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: env.jwtExpiresIn
    }
  )
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar_url,
    phone: user.phone || '',
    address: user.address || '',
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }
}
