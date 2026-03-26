// src/components/ProductCard.jsx
import { useNavigate } from 'react-router-dom'

const CATEGORY_COLORS = {
  Vegetables: 'bg-green-100 text-green-800',
  Fruits:     'bg-amber-100 text-amber-800',
  Grains:     'bg-yellow-100 text-yellow-800',
  Poultry:    'bg-orange-100 text-orange-800',
  Dairy:      'bg-blue-100 text-blue-800',
  Others:     'bg-purple-100 text-purple-800',
}

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const categoryColor = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-700'

  return (
    <div
      className="card cursor-pointer group animate-fade-in"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </span>
        <div className="absolute top-3 left-3">
          <span className={`badge ${categoryColor} text-xs`}>{product.category}</span>
        </div>
        {product.quantity < 20 && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-red-100 text-red-700 text-xs">Low Stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-base mb-1 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-green-700 font-bold text-lg">
            KES {product.price.toLocaleString()}
          </span>
          <span className="text-gray-400 text-xs">/{product.unit}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}>
              ★
            </span>
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>👤</span> {product.farmer}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>📞</span> {product.phone}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>📍</span> {product.location}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="btn-primary w-full text-sm py-2 group-hover:bg-green-700 transition-colors">
          View Details
        </div>
      </div>
    </div>
  )
}