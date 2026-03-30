// src/services/api.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── Axios Instance ───────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('f2f_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('f2f_token')
      localStorage.removeItem('f2f_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Error helper ─────────────────────────────────────────
export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong.'

// ─── AUTH ─────────────────────────────────────────────────
export const authService = {
  register: async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role })
    localStorage.setItem('f2f_token', data.token)
    localStorage.setItem('f2f_user', JSON.stringify(data.user))
    return data
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('f2f_token', data.token)
    localStorage.setItem('f2f_user', JSON.stringify(data.user))
    return data
  },

  logout: () => {
    localStorage.removeItem('f2f_token')
    localStorage.removeItem('f2f_user')
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/me', updates)
    return data
  },
}

// ─── PRODUCTS ─────────────────────────────────────────────
export const productService = {
  getAll: async ({ search = '', category = '', sort = '', page = 1, limit = 12 } = {}) => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category && category !== 'All') params.append('category', category)
    if (sort) params.append('sort', sort)
    params.append('page', page)
    params.append('limit', limit)
    const { data } = await api.get(`/products?${params.toString()}`)
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data.product
  },

  getMyProducts: async () => {
    const { data } = await api.get('/products/my')
    return data.products
  },

  create: async (formData) => {
    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.product
  },

  update: async (id, formData) => {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.product
  },

  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`)
    return data
  },
}

// ─── AI CROP DETECTION ────────────────────────────────────
export const aiService = {
  analyzeImage: async (imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    const { data } = await api.post('/crop/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.result
  },

  getScanHistory: async () => {
    const { data } = await api.get('/crop/history')
    return data.scans
  },
}

// ─── PAYMENTS ─────────────────────────────────────────────
export const paymentService = {
  initiateStkPush: async (productId, phone, quantity = 1) => {
    const { data } = await api.post('/payments/stk-push', { productId, phone, quantity })
    return data
  },

  checkStatus: async (orderId) => {
    const { data } = await api.get(`/payments/status/${orderId}`)
    return data.order
  },

  pollUntilComplete: async (orderId, onStatusUpdate) => {
    const MAX_ATTEMPTS = 12
    const INTERVAL_MS = 5000
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS))
      const order = await paymentService.checkStatus(orderId)
      onStatusUpdate && onStatusUpdate(order.status)
      if (order.status === 'paid')   return { success: true, order }
      if (order.status === 'failed') return { success: false, order }
    }
    return { success: false, order: null, timedOut: true }
  },

  getMyOrders: async () => {
    const { data } = await api.get('/payments/orders')
    return data.orders
  },
}

// ─── Image URL helper ─────────────────────────────────────
export const getImageUrl = (filename, type = 'products') => {
  if (!filename) return null
  if (filename.startsWith('http')) return filename
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${base}/uploads/${type}/${filename}`
}

export default api
