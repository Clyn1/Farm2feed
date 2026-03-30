// src/pages/OrderTracking.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { paymentService, getErrorMessage, getImageUrl } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/Spinner.jsx'

const STATUS_STEPS = [
  {
    key: 'pending',
    label: 'Order Placed',
    desc: 'Your order has been placed and payment is being processed.',
    icon: '📋',
    color: 'bg-yellow-500',
  },
  {
    key: 'paid',
    label: 'Payment Confirmed',
    desc: 'Your payment was received. The farmer has been notified.',
    icon: '✅',
    color: 'bg-green-500',
  },
  {
    key: 'processing',
    label: 'Being Prepared',
    desc: 'The farmer is preparing your order for dispatch.',
    icon: '🧑‍🌾',
    color: 'bg-blue-500',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Your order has been delivered. Enjoy your fresh produce!',
    icon: '🎉',
    color: 'bg-green-700',
  },
]

const STATUS_INDEX = {
  pending:    0,
  paid:       1,
  processing: 2,
  delivered:  3,
  failed:     -1,
  cancelled:  -1,
}

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate    = useNavigate()
  const { isLoggedIn } = useAuth()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await paymentService.checkStatus(orderId)
      setOrder(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Spinner size="lg" label="Loading order details..." />
    </div>
  )

  if (error || !order) return (
    <div className="text-center py-20 max-w-md mx-auto px-4">
      <div className="text-5xl mb-4">😕</div>
      <h3 className="font-semibold text-gray-700 mb-2">{error || 'Order not found'}</h3>
      <button className="btn-primary mt-4" onClick={() => navigate('/dashboard/consumer')}>
        Back to Dashboard
      </button>
    </div>
  )

  const currentStep = STATUS_INDEX[order.status] ?? 0
  const isFailed    = order.status === 'failed' || order.status === 'cancelled'

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard/consumer')}
        className="flex items-center gap-1.5 text-green-700 font-medium text-sm mb-6 hover:text-green-900 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">ORDER ID</p>
            <h1 className="font-display text-2xl text-gray-800">
              #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-KE', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <span className={`badge text-sm px-3 py-1 ${
              isFailed
                ? 'bg-red-100 text-red-700'
                : order.status === 'paid' || order.status === 'delivered'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {isFailed ? '❌ ' : order.status === 'delivered' ? '✅ ' : '⏳ '}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <p className="text-gray-800 font-bold text-xl mt-2">
              KES {order.totalAmount?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Failed state */}
      {isFailed && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-5 text-center">
          <div className="text-4xl mb-3">❌</div>
          <h3 className="font-display text-xl text-red-700 mb-2">
            {order.status === 'cancelled' ? 'Order Cancelled' : 'Payment Failed'}
          </h3>
          <p className="text-red-500 text-sm mb-4">
            {order.status === 'cancelled'
              ? 'This order was cancelled.'
              : 'The payment could not be processed. Please try again.'}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate(`/products/${order.product?._id}`)}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Progress tracker */}
      {!isFailed && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="font-display text-lg text-gray-800 mb-6">Order Progress</h2>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-green-500 transition-all duration-1000"
              style={{ height: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />

            <div className="space-y-6">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStep
                const isCurrent  = index === currentStep
                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    {/* Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg border-2 transition-all duration-500 z-10 ${
                      isCompleted
                        ? `${step.color} border-transparent text-white`
                        : 'bg-white border-gray-200 text-gray-300'
                    } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                      {isCompleted ? step.icon : '○'}
                    </div>
                    {/* Text */}
                    <div className="pt-1.5">
                      <p className={`font-semibold text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="font-display text-lg text-gray-800 mb-4">Order Details</h2>
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100 mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
            {order.product?.image ? (
              <img
                src={getImageUrl(order.product.image, 'products')}
                alt={order.product?.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : '🌿'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{order.product?.name || 'Product'}</h3>
            <p className="text-sm text-gray-500">
              Quantity: {order.quantity} × KES {order.product?.price?.toLocaleString()}
            </p>
            <p className="text-green-700 font-bold mt-1">
              Total: KES {order.totalAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Farmer',         value: order.farmer?.name || 'Farmer' },
            { label: 'Farmer Phone',   value: order.farmer?.phone || '—', highlight: true },
            { label: 'Payment Phone',  value: order.phone },
            { label: 'Payment Method', value: 'M-Pesa' },
            ...(order.payment?.mpesaReceiptNumber ? [
              { label: 'M-Pesa Receipt', value: order.payment.mpesaReceiptNumber, highlight: true },
            ] : []),
            ...(order.payment?.paidAt ? [
              { label: 'Paid At', value: new Date(order.payment.paidAt).toLocaleString('en-KE') },
            ] : []),
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 font-medium">{row.label}</span>
              <span className={`text-sm font-semibold ${row.highlight ? 'text-green-700' : 'text-gray-800'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact farmer */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-green-800 mb-1">Need help with your order?</h3>
          <p className="text-green-600 text-sm">Contact the farmer directly for delivery updates.</p>
        </div>
        <div className="flex gap-3">
          {order.farmer?.phone && (
            <a
              href={`tel:${order.farmer.phone.replace(/\s/g, '')}`}
              className="btn-primary text-sm"
            >
              📞 Call Farmer
            </a>
          )}
          <button
            onClick={fetchOrder}
            className="btn-secondary text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  )
}
