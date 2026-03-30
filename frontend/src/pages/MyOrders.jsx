// src/pages/MyOrders.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { paymentService, getErrorMessage, getImageUrl } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/Spinner.jsx'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  paid:      { label: 'Paid',      color: 'bg-green-100 text-green-700',   icon: '✅' },
  processing:{ label: 'Processing',color: 'bg-blue-100 text-blue-700',     icon: '🧑‍🌾' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800',   icon: '🎉' },
  failed:    { label: 'Failed',    color: 'bg-red-100 text-red-700',       icon: '❌' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-600',     icon: '🚫' },
}

export default function MyOrders() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await paymentService.getMyOrders()
      setOrders(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const FILTERS = ['all', 'pending', 'paid', 'delivered', 'failed']

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter)

  const totalSpent = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-gray-800 mb-1">My Orders 🛒</h1>
          <p className="text-gray-500 text-sm">
            {orders.length} total orders · KES {totalSpent.toLocaleString()} spent
          </p>
        </div>
        <button onClick={() => navigate('/products')} className="btn-primary text-sm">
          + New Order
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-75">
                ({orders.filter((o) => o.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" label="Loading your orders..." />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <span>⚠️</span> {error}
          <button onClick={fetchOrders} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="font-semibold text-gray-700 mb-1">
            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {filter === 'all'
              ? 'Start shopping to see your orders here.'
              : `You have no ${filter} orders at the moment.`}
          </p>
          {filter === 'all' && (
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          )}
        </div>
      )}

      {/* Orders list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        ORDER · {new Date(order.createdAt).toLocaleDateString('en-KE', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                      <p className="font-mono text-sm font-semibold text-green-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`badge ${status.color} text-xs px-3 py-1`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Product info */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-4">
                    <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {order.product?.image ? (
                        <img
                          src={getImageUrl(order.product.image, 'products')}
                          alt={order.product?.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : '🌿'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {order.product?.name || 'Product'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {order.quantity} · KES {order.product?.price?.toLocaleString()} each
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Farmer: {order.farmer?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-800 text-lg">
                        KES {order.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* M-Pesa receipt */}
                  {order.payment?.mpesaReceiptNumber && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                      <span>📱</span>
                      <span>M-Pesa Receipt:</span>
                      <span className="font-semibold text-green-700">
                        {order.payment.mpesaReceiptNumber}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="btn-primary text-sm flex-1 sm:flex-none"
                    >
                      🔍 Track Order
                    </button>
                    {order.farmer?.phone && (
                      <a
                        href={`tel:${order.farmer.phone.replace(/\s/g, '')}`}
                        className="btn-secondary text-sm flex-1 sm:flex-none text-center"
                      >
                        📞 Call Farmer
                      </a>
                    )}
                    {(order.status === 'failed' || order.status === 'cancelled') && (
                      <button
                        onClick={() => navigate(`/products/${order.product?._id}`)}
                        className="btn-secondary text-sm flex-1 sm:flex-none"
                      >
                        🔄 Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
