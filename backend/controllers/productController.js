const Product = require('../models/Product')

const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query
    const query = { isAvailable: true }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }
    if (category && category !== 'All') query.category = category
    let sortOption = { createdAt: -1 }
    if (sort === 'price-asc')  sortOption = { price: 1 }
    if (sort === 'price-desc') sortOption = { price: -1 }
    if (sort === 'rating')     sortOption = { rating: -1 }
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [products, total] = await Promise.all([
      Product.find(query).populate('farmer', 'name email phone location').sort(sortOption).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query),
    ])
    res.status(200).json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), products })
  } catch (error) { next(error) }
}

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email phone location')
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
    res.status(200).json({ success: true, product })
  } catch (error) { next(error) }
}

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, unit, quantity, category, phone, location } = req.body
    const productData = { name, description, price: Number(price), unit, quantity: Number(quantity), category, phone, location, farmer: req.user.id }
    if (req.file) productData.image = req.file.filename
    const product = await Product.create(productData)
    await product.populate('farmer', 'name email phone location')
    res.status(201).json({ success: true, message: 'Product listed successfully.', product })
  } catch (error) { next(error) }
}

const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
    if (product.farmer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' })
    const updates = { ...req.body }
    if (req.file) updates.image = req.file.filename
    product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate('farmer', 'name email phone location')
    res.status(200).json({ success: true, message: 'Product updated.', product })
  } catch (error) { next(error) }
}

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
    if (product.farmer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized.' })
    await product.deleteOne()
    res.status(200).json({ success: true, message: 'Product removed.' })
  } catch (error) { next(error) }
}

const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, products })
  } catch (error) { next(error) }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts }
