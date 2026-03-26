// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_PRODUCTS } from '../services/mockData.js'
import ProductCard from '../components/ProductCard.jsx'
import Footer from '../components/Footer.jsx'

const HOW_IT_WORKS = [
  { icon: '🧑‍🌾', title: 'Farmers List Products', desc: 'Farmers upload their produce with photos, prices, and contact details in minutes.' },
  { icon: '🔍', title: 'Consumers Browse', desc: 'Shoppers explore a curated marketplace of fresh, local produce from verified farmers.' },
  { icon: '📱', title: 'Pay via M-Pesa', desc: 'Secure mobile payments via M-Pesa STK push — fast, reliable, cashless.' },
  { icon: '🤖', title: 'AI Crop Analysis', desc: 'Farmers get instant disease detection and treatment advice from our AI engine.' },
]

const STATS = [
  { num: '1,200+', label: 'Farmers' },
  { num: '8,500+', label: 'Products' },
  { num: '32,000+', label: 'Consumers' },
  { num: '47', label: 'Counties' },
]

export default function Home() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const featured = MOCK_PRODUCTS.slice(0, 4)

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate(user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer')
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-100" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            Now serving 47 counties across Kenya
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Farm Fresh,<br />Delivered to You 🌾
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect directly with local farmers. Get fresh produce, support agriculture, and enjoy AI-powered crop intelligence — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto bg-white text-green-700 font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              Browse Products
            </button>
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto border-2 border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all active:scale-95"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Join as Farmer'}
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {['🤖 AI Crop Detection', '📱 M-Pesa Payments', '🌍 100% Local', '✅ Verified Farmers'].map((f) => (
              <span key={f} className="bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-4 py-2">
              <div className="font-display text-2xl md:text-3xl font-bold text-green-700">{s.num}</div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl text-gray-800 mb-1">Featured Produce 🛒</h2>
            <p className="text-gray-500 text-sm">Fresh from verified farms across Kenya</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-green-600 text-sm font-semibold hover:text-green-800 transition-colors hidden sm:block"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <button onClick={() => navigate('/products')} className="btn-primary">
            View All Products
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl text-gray-800 mb-2">How Farm2Feed Works</h2>
            <p className="text-gray-500 text-sm">From field to table in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl border border-gray-100 bg-green-50/40 hover:border-green-200 hover:bg-green-50 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Ready to get started?
            </h2>
            <p className="text-green-100 mb-6 max-w-md mx-auto">
              Join thousands of Kenyan farmers and consumers on Farm2Feed today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-all shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate('/products')}
                className="border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 transition-all active:scale-95"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}