const express = require('express')
const router = express.Router()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController')
const { protect, authorize } = require('../middleware/auth')
const upload = require('../config/multer')

router.get('/', getProducts)
router.get('/my', protect, authorize('farmer'), getMyProducts)
router.get('/:id', getProduct)
router.post('/', protect, authorize('farmer'), upload.single('image'), createProduct)
router.put('/:id', protect, authorize('farmer'), upload.single('image'), updateProduct)
router.delete('/:id', protect, authorize('farmer'), deleteProduct)

module.exports = router
