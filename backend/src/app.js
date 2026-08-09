import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { apiLimiter } from './middleware/rateLimit.js'
import authRoutes from './routes/authRoutes.js'
import catalogRoutes from './routes/catalogRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js'

const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    // Allow all vercel.app domains, localhost, and the configured CLIENT_ORIGIN
    const allowed = [
      env.clientOrigin,
      'http://localhost:3000',
      'http://localhost:5173',
    ]
    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use('/api', apiLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/restaurants', restaurantRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((error, req, res, next) => {
  void next
  console.error(error)
  res.status(500).json({ message: 'Something went wrong on the server' })
})

export default app
