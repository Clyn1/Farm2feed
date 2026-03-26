// src/pages/Products.jsx
import { useState, useEffect } from 'react'
import { productService } from '../services/api.js'
import ProductCard from '../components/ProductCard.jsx'
import Spinner from '../components/Spinner.jsx'

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Poultry', 'Dairy', 'Others']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    productService.getAll().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.farmer.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || p.category === category
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating')     return b.rating - a.rating
      return 0
    })

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-3xl text-gray-800 mb-1">Browse Products 🛒</h1>
        <p className="text-gray-500 text-sm">
          {loading ? '...' : `${products.length} products from verified farmers across Kenya`}
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            className="form-input pl-9"
            placeholder="Search products, farmers, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Sort */}
        <select
          className="form-input sm:w-44"
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" label="Loading products..." />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-700 mb-1">No products found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or category filter.</p>
          <button
            className="btn-secondary mt-4"
            onClick={() => { setSearch(''); setCategory('All') }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-4">
            Showing {filtered.length} of {products.length} products
            {category !== 'All' && ` in ${category}`}
            {search && ` matching "${search}"`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
