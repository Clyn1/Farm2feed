require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

connectDB()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/crop',     require('./routes/cropRoutes'))
app.use('/api/payments', require('./routes/paymentRoutes'))

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌱 Farm2Feed API is running.',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Farm2Feed API running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)
})
