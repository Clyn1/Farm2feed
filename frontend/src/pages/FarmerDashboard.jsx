// src/pages/FarmerDashboard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../services/mockData.js'
import AddProductForm from '../components/AddProductForm.jsx'
import CropDetector from '../components/CropDetector.jsx'

const TABS = [
  { id: 'overview',     label: 'Overview',     icon: '📊' },
  { id: 'add-product',  label: 'Add Product',  icon: '➕' },
  { id: 'crop-ai',      label: 'Crop AI',      icon: '🤖' },
  { id: 'orders',       label: 'Orders',       icon: '🧾' },
]

export default function FarmerDashboard() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [myProducts, setMyProducts] = useState(MOCK_PRODUCTS.slice(0, 3))

  const handleProductAdded = (product) => {
    setMyProducts((prev) => [product, ...prev])
    setActiveTab('overview')
  }

  const handleRemoveProduct = (id) => {
    setMyProducts((prev) => prev.filter((p) => p.id !== id))
    showToast('Product removed.', 'success')
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 py-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 mb-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-green-200 text-sm font-medium mb-0.5">Farmer Dashboard</p>
            <h1 className="font-display text-2xl font-bold">
              Good morning, <span className="capitalize">{user?.name}</span> 👋
            </h1>
            <p className="text-green-200 text-sm mt-1">
              Manage your listings, detect crop diseases, and track orders.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-sm font-medium border border-white/20">
            <span>🧑‍🌾</span> Farmer
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { icon: '📦', value: myProducts.length, label: 'Listed Products' },
          { icon: '💰', value: 'KES 24,500', label: 'Total Earnings' },
          { icon: '🛒', value: '12', label: 'Total Orders' },
          { icon: '⭐', value: '4.8', label: 'Avg Rating' },
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

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-max flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-white text-green-700 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in" key={activeTab}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="font-display text-xl text-gray-800 mb-4">My Listed Products</h2>
            {myProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-semibold text-gray-600 mb-1">No products yet</h3>
                <p className="text-gray-400 text-sm mb-4">Add your first product to start selling.</p>
                <button className="btn-primary" onClick={() => setActiveTab('add-product')}>
                  + Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((p, i) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="h-28 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-5xl">
                      {p.emoji}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{p.name}</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-green-700 font-bold">KES {p.price}/{p.unit}</p>
                      <p className="text-xs text-gray-400 mb-3">Qty: {p.quantity} available</p>
                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        className="w-full py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-xl text-gray-800 mb-1">List a New Product</h2>
            <p className="text-gray-400 text-sm mb-5">Fill in the details below to list your produce on Farm2Feed.</p>
            <AddProductForm onProductAdded={handleProductAdded} />
          </div>
        )}

        {/* CROP AI */}
        {activeTab === 'crop-ai' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-5">
              <h2 className="font-display text-xl text-gray-800 mb-1">🤖 AI Crop Disease Detector</h2>
              <p className="text-gray-400 text-sm">
                Upload a photo of your crop. Our AI will identify any diseases and recommend treatments instantly.
              </p>
            </div>
            <CropDetector />
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-display text-xl text-gray-800">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Product', 'Buyer', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ORDERS.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-green-700">{o.id}</td>
                      <td className="px-4 py-3 text-gray-700">{o.product}</td>
                      <td className="px-4 py-3 text-gray-500">{o.buyer}</td>
                      <td className="px-4 py-3 font-semibold">KES {o.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${
                          o.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
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
          </div>
        )}
      </div>
    </div>
  )
}
