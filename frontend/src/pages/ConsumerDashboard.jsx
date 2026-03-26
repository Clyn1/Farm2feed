// src/pages/ConsumerDashboard.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_CONSUMER_ORDERS } from '../services/mockData.js'

export default function ConsumerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-6 mb-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-green-200 text-sm font-medium mb-0.5">Consumer Dashboard</p>
            <h1 className="font-display text-2xl font-bold">
              Hello, <span className="capitalize">{user?.name}</span> 🛍️
            </h1>
            <p className="text-green-200 text-sm mt-1">
              Track your orders and discover fresh produce near you.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-sm font-medium border border-white/20">
            <span>🛍️</span> Consumer
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { icon: '🛒', value: '7', label: 'Total Orders' },
          { icon: '💚', value: 'KES 4,820', label: 'Total Spent' },
          { icon: '👨‍🌾', value: '3', label: 'Fav. Farmers' },
          { icon: '⭐', value: '12', label: 'Reviews Given' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {s.icon}
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg leading-tight">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        <div
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border border-green-200 cursor-pointer hover:shadow-md transition-all group"
          onClick={() => navigate('/products')}
        >
          <div className="text-3xl mb-2">🛒</div>
          <h3 className="font-semibold text-green-800 mb-1 group-hover:text-green-900">Browse Products</h3>
          <p className="text-green-600 text-sm">Discover fresh produce from farmers near you.</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border border-amber-200 cursor-pointer hover:shadow-md transition-all group">
          <div className="text-3xl mb-2">📍</div>
          <h3 className="font-semibold text-amber-800 mb-1 group-hover:text-amber-900">Nearby Farmers</h3>
          <p className="text-amber-600 text-sm">Find verified farmers in your county.</p>
        </div>
      </div>

      {/* Order history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-xl text-gray-800">My Orders</h2>
          <span className="text-xs text-gray-400">{MOCK_CONSUMER_ORDERS.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Product', 'Farmer', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_CONSUMER_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-green-700">{o.id}</td>
                  <td className="px-4 py-3 text-gray-700">{o.product}</td>
                  <td className="px-4 py-3 text-gray-500">{o.farmer}</td>
                  <td className="px-4 py-3 font-semibold">KES {o.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${
                      o.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button className="btn-primary w-full sm:w-auto" onClick={() => navigate('/products')}>
            Shop More Products →
          </button>
        </div>
      </div>
    </div>
  )
}
