// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService, getErrorMessage, getImageUrl } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import PaymentModal from '../components/PaymentModal.jsx'
import Spinner from '../components/Spinner.jsx'

const EMOJI_MAP = {
  Vegetables: '🥬', Fruits: '🍎', Grains: '🌾',
  Poultry: '🥚', Dairy: '🥛', Others: '🌿',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const { showToast } = useToast()
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [isPaid, setIsPaid]           = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const data = await productService.getById(id)
        setProduct(data)
      } catch (err) {
        setError(getErrorMessage(err))
        showToast('Product not found.', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleBuy = () => {
    if (!isLoggedIn) {
      showToast('Please sign in to purchase.', 'error')
      navigate('/login')
      return
    }
    if (user.role === 'farmer') {
      showToast('Farmers cannot purchase products.', 'error')
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (order) => {
    setIsPaid(true)
    setShowPayment(false)
  }

  // Get farmer name safely regardless of whether farmer is an object or string
  const getFarmerName = () => {
    if (!product.farmer) return 'Unknown'
    if (typeof product.farmer === 'object') return product.farmer.name || 'Unknown'
    return product.farmer
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Spinner size="lg" label="Loading product..." />
    </div>
  )

  if (error || !product) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h3 className="font-semibold text-gray-700 mb-2">{error || 'Product not found'}</h3>
      <button className="btn-primary mt-4" onClick={() => navigate('/products')}>
        Back to Products
      </button>
    </div>
  )

  const emoji = EMOJI_MAP[product.category] || '🌿'

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-1.5 text-green-700 font-medium text-sm mb-6 hover:text-green-900 transition-colors group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        Back to Products
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">

        {/* Product Image */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={getImageUrl(product.image, 'products')}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <span className="text-9xl">{emoji}</span>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="badge bg-white/90 text-green-800 text-xs shadow-sm border border-green-100">
              {product.category}
            </span>
            {isPaid && (
              <span className="badge bg-green-600 text-white text-xs shadow-sm animate-scale-in">
                Paid
              </span>
            )}
          </div>

          {product.quantity < 10 && (
            <div className="absolute top-4 right-4">
              <span className="badge bg-red-500 text-white text-xs shadow-sm">
                Low Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Body */}
        <div className="p-6 md:p-8">

          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h1 className="font-display text-3xl text-gray-800 mb-1">{product.name}</h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={'text-sm ' + (i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200')}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-400">({product.numReviews} reviews)</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-display text-3xl text-green-700 font-bold">
                {'KES ' + (product.price ? product.price.toLocaleString() : '0')}
              </div>
              <div className="text-gray-400 text-sm">{'per ' + product.unit}</div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
              {product.description}
            </p>
          )}

          {/* Info Grid */}
          <div className="bg-gray-50 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Farmer',    value: '👤 ' + getFarmerName() },
              { label: 'Location',  value: '📍 ' + (product.location || 'Kenya') },
              { label: 'Phone',     value: '📞 ' + (product.phone || ''), highlight: true },
              { label: 'Available', value: '📦 ' + product.quantity + ' ' + product.unit },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-20 flex-shrink-0">{row.label}</span>
                <span className={'text-sm font-medium ' + (row.highlight ? 'text-green-700' : 'text-gray-800')}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isPaid ? (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold">
                <span>✅</span> Order Placed — Paid Successfully
              </div>
            ) : (
              <button onClick={handleBuy} className="btn-primary flex-1 py-3 text-base">
                {'💳 Buy Now — KES ' + (product.price ? product.price.toLocaleString() : '0')}
              </button>
            )}
            <a
              href={'tel:' + (product.phone || '').replace(/\s/g, '')}
              className="btn-secondary flex-1 py-3 text-center"
            >
              📞 Call Farmer
            </a>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          product={product}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
