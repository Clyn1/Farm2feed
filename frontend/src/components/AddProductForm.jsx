// src/components/AddProductForm.jsx
import { useState, useRef } from 'react'
import { productService } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from './Spinner.jsx'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Poultry', 'Dairy', 'Others']
const UNITS = ['kg', 'bundle', 'tray', 'litre', 'piece', 'bag', 'sack', 'crate']

const INITIAL_FORM = { name: '', price: '', unit: 'kg', quantity: '', category: 'Vegetables', phone: '', description: '' }

export default function AddProductForm({ onProductAdded }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()
  const { showToast } = useToast()
  const { user } = useAuth()

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name = 'Product name is required.'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price.'
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) e.quantity = 'Enter a valid quantity.'
    if (!form.phone.trim())       e.phone = 'Phone number is required.'
    return e
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const product = await productService.create({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        emoji: '🌿',
        farmer: user?.name || 'You',
        location: user?.location || 'Kenya',
        rating: 0,
        reviews: 0,
      })
      showToast('Product listed successfully! 🎉', 'success')
      setForm(INITIAL_FORM)
      setImageFile(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ''
      onProductAdded && onProductAdded(product)
    } catch (err) {
      showToast('Failed to add product. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="sm:col-span-2">
          <label className="form-label">PRODUCT NAME *</label>
          <input
            className={`form-input ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
            placeholder="e.g. Fresh Tomatoes"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="form-label">PRICE (KES) *</label>
          <input
            type="number"
            min="1"
            className={`form-input ${errors.price ? 'border-red-300' : ''}`}
            placeholder="120"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Unit */}
        <div>
          <label className="form-label">UNIT</label>
          <select className="form-input" value={form.unit} onChange={(e) => set('unit', e.target.value)}>
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="form-label">QUANTITY AVAILABLE *</label>
          <input
            type="number"
            min="1"
            className={`form-input ${errors.quantity ? 'border-red-300' : ''}`}
            placeholder="50"
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="form-label">CATEGORY</label>
          <select className="form-input" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label className="form-label">CONTACT PHONE NUMBER *</label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? 'border-red-300' : ''}`}
            placeholder="+254 712 345 678"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="form-label">DESCRIPTION (OPTIONAL)</label>
          <textarea
            className="form-input resize-none"
            rows={3}
            placeholder="Describe your product — freshness, origin, how it's grown..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="form-label">PRODUCT IMAGE (OPTIONAL)</label>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        {!imagePreview ? (
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-300 hover:bg-green-50/40 transition-all"
            onClick={() => fileRef.current.click()}
          >
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm text-gray-500">Click to upload product image</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP</p>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="preview" className="w-full h-44 object-cover" />
            <button
              type="button"
              onClick={() => { setImageFile(null); setImagePreview(null); fileRef.current.value = '' }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full text-sm flex items-center justify-center transition-colors"
            >✕</button>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
        {loading ? (
          <><Spinner size="sm" color="white" /> Listing product...</>
        ) : (
          '+ List Product'
        )}
      </button>
    </form>
  )
}