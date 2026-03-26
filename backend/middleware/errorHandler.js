const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'CastError') {
    message = `Resource not found with id: ${err.value}`
    statusCode = 404
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
    statusCode = 400
  }
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e) => e.message).join(', ')
    statusCode = 400
  }
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token.'
    statusCode = 401
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired. Please log in again.'
    statusCode = 401
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large. Maximum size is 5MB.'
    statusCode = 400
  }

  console.error(`[ERROR] ${statusCode} — ${message}`)
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler
