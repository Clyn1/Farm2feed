require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

connectDB()

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/crop',     require('./routes/cropRoutes'))
app.use('/api/payments', require('./routes/paymentRoutes'))

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌱 Farm2Feed API is running.',
    timestamp: new Date().toISOString(),
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 10000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
