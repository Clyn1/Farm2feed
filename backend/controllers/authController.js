const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, location } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' })
    }
    const user = await User.create({ name, email, password, role, phone, location })
    const token = generateToken(user._id)
    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location },
    })
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    const token = generateToken(user._id)
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location },
    })
  } catch (error) { next(error) }
}

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({ success: true, user })
  } catch (error) { next(error) }
}

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location } = req.body
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, location }, { new: true, runValidators: true })
    res.status(200).json({ success: true, message: 'Profile updated.', user })
  } catch (error) { next(error) }
}

module.exports = { register, login, getMe, updateProfile }
