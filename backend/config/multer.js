const multer = require('multer')
const path = require('path')
const fs = require('fs')

const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

createDir('uploads/products')
createDir('uploads/crops')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = req.baseUrl.includes('crop') ? 'uploads/crops' : 'uploads/products'
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const extValid = allowed.test(path.extname(file.originalname).toLowerCase())
  const mimeValid = allowed.test(file.mimetype)
  if (extValid && mimeValid) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP) are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
})

module.exports = upload
