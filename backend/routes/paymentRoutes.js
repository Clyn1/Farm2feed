const express = require('express')
const router = express.Router()
const { initiateStkPush, mpesaCallback, checkPaymentStatus, getMyOrders } = require('../controllers/paymentController')
const { protect } = require('../middleware/auth')

router.post('/stk-push', protect, initiateStkPush)
router.post('/callback', mpesaCallback)
router.get('/status/:orderId', protect, checkPaymentStatus)
router.get('/orders', protect, getMyOrders)

module.exports = router
