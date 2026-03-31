// src/pages/Products.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService, getErrorMessage, getImageUrl } from '../services/api.js'
import Spinner from '../components/Spinner.jsx'

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Poultry', 'Dairy', 'Others']

const CATEGORY_COLORS = {
  Vegetables: 'bg-green-100 text-green-800',
  Fruits:     'bg-amber-100 text-amber-800',
  Grains:     'bg-yellow-100 text-yellow-800',
  Poultry:    'bg-orange-100 text-orange-800',
  Dairy:      'bg-blue-100 text-blue-800',
  Others:     'bg-purple-100 text-purple-800',
}

const EMOJI_MAP = {
  Vegetables: '🥬', Fruits: '🍎', Grains: '🌾',
  Poultry: '🥚', Dairy: '🥛', Others: '🌿',
}

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [sortBy, setSortBy]         = useState('default')
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await productService.getAll({
        search,
        category,
        sort: sortBy === 'default' ? '' : sortBy,
        page,
        limit: 12,
      })
      setProducts(data.products || [])
      setTotalPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (err) {
      setError(getErrorMessage(err))
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search, category, sortBy, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1)
  }, [search, category, sortBy])

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setSortBy('default')
    setPage(1)
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-3xl text-gray-800 mb-1">Browse Products 🛒</h1>
        <p className="text-gray-500 text-sm">
          {loading
            ? 'Loading...'
            : `${total} fresh products from verified farmers across Kenya`}
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            className="form-input pl-9"
            placeholder="Search products, farmers, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-input sm:w-48"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-7">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
              category === cat
                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-red-500">⚠️</span>
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button onClick={fetchProducts} className="text-xs text-red-600 underline font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-24">
          <Spinner size="lg" label="Loading products..." />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🌾</div>
          <h3 className="font-display text-xl text-gray-700 mb-2">
            {search || category !== 'All' ? 'No products match your search' : 'No products yet'}
          </h3>
          <p className="text-gray-400 text-sm mb-5 max-w-sm mx-auto">
            {search || category !== 'All'
              ? 'Try adjusting your filters or search term.'
              : 'Farmers have not listed any products yet. Check back soon!'}
          </p>
          {(search || category !== 'All') && (
            <button className="btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-4">
            Showing {products.length} of {total} products
            {category !== 'All' && ` in ${category}`}
            {search && ` matching "${search}"`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product, i) => {
              const catColor = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-700'
              const emoji    = EMOJI_MAP[product.category] || '🌿'

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image, 'products')}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 items-center justify-center text-6xl"
                      style={{ display: product.image ? 'none' : 'flex' }}
                    >
                      {emoji}
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${catColor}`}>
                        {product.category}
                      </span>
                    </div>
                    {product.quantity < 10 && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Low Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-green-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-green-700 font-bold text-lg">
                        KES {product.price?.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-xs">/{product.unit}</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>👤</span>
                        <span className="truncate">{product.farmer?.name || 'Farmer'}</span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>📞</span>
                        <span>{product.phone}</span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>📍</span>
                        <span>{product.location || 'Kenya'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="w-full text-center py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      View Details
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
