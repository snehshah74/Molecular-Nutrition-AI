import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from './config/env.js'

// Import routes
import healthRouter from './routes/health.js'
import profileRouter from './routes/profile.js'
import mealRouter from './routes/meal.js'
import recommendationRouter from './routes/recommendation.js'
import biomarkerRouter from './routes/biomarker.js'
import nutritionRouter from './routes/nutrition.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Body parsing and compression
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(compression())

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check (no auth required)
app.use('/api/health', healthRouter)

// API routes (with authentication)
app.use('/api/profile', authMiddleware, profileRouter)
app.use('/api/meals', authMiddleware, mealRouter)
app.use('/api/recommendations', authMiddleware, recommendationRouter)
app.use('/api/biomarkers', authMiddleware, biomarkerRouter)
app.use('/api/nutrition', authMiddleware, nutritionRouter)

// Error handling
app.use(errorHandler)

// Start server
const PORT = config.port

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${config.nodeEnv}`)
  console.log(`🔗 CORS enabled for: ${config.cors.origin}`)
})

export default app

