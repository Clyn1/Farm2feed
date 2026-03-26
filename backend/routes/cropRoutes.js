const express = require('express')
const router = express.Router()
const { analyzeCrop, getScanHistory } = require('../controllers/cropController')
const { protect, authorize } = require('../middleware/auth')
const upload = require('../config/multer')

router.post('/analyze', protect, authorize('farmer'), upload.single('image'), analyzeCrop)
router.get('/history', protect, authorize('farmer'), getScanHistory)

module.exports = router
