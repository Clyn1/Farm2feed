const axios = require('axios')
const Order = require('../models/Order')
const Product = require('../models/Product')

const getMpesaToken = async () => {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')
  const response = await axios.get(`${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${auth}` } })
  return response.data.access_token
}

const getTimestamp = () => new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)

const getMpesaPassword = (timestamp) => Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64')

const formatPhone = (phone) => {
  let p = phone.replace(/\s/g, '').replace(/-/g, '')
  if (p.startsWith('+254')) p = p.slice(1)
  if (p.startsWith('0')) p = '254' + p.slice(1)
  if (p.startsWith('7') || p.startsWith('1')) p = '254' + p
  return p
}

const initiateStkPush = async (req, res, next) => {
  try {
    const { productId, phone, quantity = 1 } = req.body
    if (!productId || !phone) return res.status(400).json({ success: false, message: 'Product ID and phone are required.' })
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
    const totalAmount = product.price * quantity
    const formattedPhone = formatPhone(phone)
    const timestamp = getTimestamp()
    const password = getMpesaPassword(timestamp)
    const token = await getMpesaToken()
    const order = await Order.create({ consumer: req.user.id, product: productId, farmer: product.farmer, quantity, totalAmount, phone: formattedPhone, status: 'pending' })
    const stkResponse = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      { BusinessShortCode: process.env.MPESA_SHORTCODE, Password: password, Timestamp: timestamp, TransactionType: 'CustomerPayBillOnline', Amount: Math.ceil(totalAmount), PartyA: formattedPhone, PartyB: process.env.MPESA_SHORTCODE, PhoneNumber: formattedPhone, CallBackURL: process.env.MPESA_CALLBACK_URL, AccountReference: `Farm2Feed-${order._id}`, TransactionDesc: `Payment for ${product.name}` },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    )
    await Order.findByIdAndUpdate(order._id, { 'payment.checkoutRequestId': stkResponse.data.CheckoutRequestID, 'payment.merchantRequestId': stkResponse.data.MerchantRequestID })
    res.status(200).json({ success: true, message: 'STK Push sent. Enter your M-Pesa PIN.', orderId: order._id, checkoutRequestId: stkResponse.data.CheckoutRequestID })
  } catch (error) {
    if (error.response?.data) return res.status(400).json({ success: false, message: error.response.data.errorMessage || 'M-Pesa initiation failed.' })
    next(error)
  }
}

const mpesaCallback = async (req, res, next) => {
  try {
    const { Body } = req.body
    const callback = Body.stkCallback
    const order = await Order.findOne({ 'payment.checkoutRequestId': callback.CheckoutRequestID })
    if (!order) return res.status(200).json({ success: true })
    if (callback.ResultCode === 0) {
      const items = callback.CallbackMetadata?.Item || []
      const get = (name) => items.find((i) => i.Name === name)?.Value
      await Order.findByIdAndUpdate(order._id, { status: 'paid', 'payment.mpesaReceiptNumber': get('MpesaReceiptNumber'), 'payment.transactionId': get('MpesaReceiptNumber'), 'payment.paidAt': new Date() })
    } else {
      await Order.findByIdAndUpdate(order._id, { status: 'failed' })
    }
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (error) { res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' }) }
}

const checkPaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('product', 'name price')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    if (order.consumer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' })
    res.status(200).json({ success: true, order })
  } catch (error) { next(error) }
}

const getMyOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'farmer' ? { farmer: req.user.id } : { consumer: req.user.id }
    const orders = await Order.find(query).populate('product', 'name price unit image').populate('consumer', 'name phone').populate('farmer', 'name phone').sort({ createdAt: -1 })
    res.status(200).json({ success: true, orders })
  } catch (error) { next(error) }
}

module.exports = { initiateStkPush, mpesaCallback, checkPaymentStatus, getMyOrders }
