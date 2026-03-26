// src/services/api.js
// Simulated API calls using Axios-style interface
// All calls return Promises with mock delays to mimic real network behavior

import axios from 'axios'
import { MOCK_PRODUCTS, AI_DISEASES } from './mockData.js'

// We create an axios instance for demonstration.
// In production, replace baseURL with your real backend.
const api = axios.create({
  baseURL: '/api', // Mocked — intercepted below
  timeout: 10000,
})

// ─── AUTH ───────────────────────────────────────────────────────────────────

export const authService = {
  login: async (email, password) => {
    await delay(1200)
    if (!email || !password) throw new Error('Please fill in all fields.')
    // Simulate role detection from email
    const role = email.toLowerCase().includes('farmer') ? 'farmer' : 'consumer'
    return {
      user: {
        id: generateId(),
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role,
        phone: '+254 712 000 000',
        location: 'Nairobi',
        joinedDate: new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long' }),
      },
      token: 'mock-jwt-token-' + generateId(),
    }
  },

  register: async (name, email, password, role) => {
    await delay(1400)
    if (!name || !email || !password) throw new Error('Please fill in all fields.')
    if (password.length < 6) throw new Error('Password must be at least 6 characters.')
    return {
      user: { id: generateId(), name, email, role, phone: '', location: '', joinedDate: new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long' }) },
      token: 'mock-jwt-token-' + generateId(),
    }
  },
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const productService = {
  getAll: async () => {
    await delay(600)
    return [...MOCK_PRODUCTS]
  },

  getById: async (id) => {
    await delay(400)
    const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))
    if (!product) throw new Error('Product not found.')
    return product
  },

  create: async (productData) => {
    await delay(1000)
    return {
      ...productData,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    }
  },

  delete: async (id) => {
    await delay(500)
    return { success: true, id }
  },
}

// ─── AI / CROP DETECTION ─────────────────────────────────────────────────────

export const aiService = {
  analyzeImage: async (imageFile) => {
    // Simulate AI model inference time (2–3 seconds)
    await delay(2200 + Math.random() * 800)
    const result = AI_DISEASES[Math.floor(Math.random() * AI_DISEASES.length)]
    return {
      ...result,
      analyzedAt: new Date().toLocaleTimeString(),
      modelVersion: 'CropDetect v2.1',
    }
  },
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export const paymentService = {
  initiateStkPush: async (phone, amount, productName) => {
    // Simulate STK push delay
    await delay(2500)
    const success = Math.random() > 0.2 // 80% success rate

    if (!success) {
      throw new Error('Payment request declined. Check your M-Pesa balance and try again.')
    }

    return {
      transactionId: 'MPE' + Date.now().toString().slice(-8).toUpperCase(),
      phone,
      amount,
      product: productName,
      status: 'COMPLETED',
      timestamp: new Date().toLocaleString('en-KE'),
    }
  },
}

// ─── UTILS ───────────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export default api