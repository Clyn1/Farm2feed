// src/pages/MarketAI.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'

// ─── Simulated AI Market Data ─────────────────────────────────────────────────
// In production: replace with real ML API calls using market price data,
// weather patterns, seasonal trends, and supply/demand analytics

const MARKET_DATA = {
  Tomatoes: {
    demand: 'Very High', demandScore: 94, trend: 'up',
    currentPrice: 120, suggestedPrice: 145, priceChange: '+20.8%',
    reason: 'Dry season reducing supply while urban demand surges. Hotels and restaurants report 40% increase in tomato purchases.',
    bestTime: 'Sell now — peak demand window',
    forecast: [110, 115, 120, 130, 145, 155, 148],
    competition: 'Low',
  },
  Maize: {
    demand: 'High', demandScore: 82, trend: 'up',
    currentPrice: 45, suggestedPrice: 52, priceChange: '+15.6%',
    reason: 'Upcoming school term increases flour demand. NCPB buying season approaching. Strategic reserve purchases expected.',
    bestTime: 'Next 2–3 weeks optimal',
    forecast: [42, 44, 45, 47, 50, 52, 51],
    competition: 'Medium',
  },
  Avocados: {
    demand: 'Very High', demandScore: 91, trend: 'up',
    currentPrice: 150, suggestedPrice: 185, priceChange: '+23.3%',
    reason: 'Export demand from Europe and Middle East at peak. Local health food trend driving domestic demand. Limited harvest season.',
    bestTime: 'Excellent — export window open',
    forecast: [140, 148, 150, 165, 180, 185, 182],
    competition: 'Low',
  },
  Sukuma: {
    demand: 'Medium', demandScore: 65, trend: 'stable',
    currentPrice: 30, suggestedPrice: 30, priceChange: '0%',
    reason: 'Stable year-round demand. Market is well-supplied. No significant price movement expected this season.',
    bestTime: 'Steady market — no rush',
    forecast: [28, 29, 30, 30, 31, 30, 30],
    competition: 'High',
  },
  Potatoes: {
    demand: 'High', demandScore: 78, trend: 'up',
    currentPrice: 55, suggestedPrice: 68, priceChange: '+23.6%',
    reason: 'Fast food industry expansion in Nairobi. Chips demand increasing in urban centers. Supply from Meru and Nyandarua reduced by rains.',
    bestTime: 'Good time to sell — prices rising',
    forecast: [50, 52, 55, 59, 64, 68, 66],
    competition: 'Medium',
  },
  Mangoes: {
    demand: 'Medium', demandScore: 55, trend: 'down',
    currentPrice: 80, suggestedPrice: 65, priceChange: '-18.8%',
    reason: 'Peak mango season — oversupply from Coast and Eastern regions. Consider value addition (drying, juice) or waiting 6–8 weeks.',
    bestTime: 'Wait or consider value addition',
    forecast: [90, 85, 80, 72, 65, 60, 58],
    competition: 'Very High',
  },
  Eggs: {
    demand: 'High', demandScore: 80, trend: 'up',
    currentPrice: 500, suggestedPrice: 560, priceChange: '+12%',
    reason: 'Easter and school holidays increase household purchases. Baking industry demand rising. Protein-conscious urban consumers driving growth.',
    bestTime: 'Sell within 2 weeks',
    forecast: [480, 490, 500, 515, 535, 560, 555],
    competition: 'Low',
  },
  Beans: {
    demand: 'High', demandScore: 76, trend: 'up',
    currentPrice: 150, suggestedPrice: 170, priceChange: '+13.3%',
    reason: 'Protein prices rising globally. Beans becoming preferred affordable protein. Institutions (schools, hospitals) increasing procurement.',
    bestTime: 'Good selling window now',
    forecast: [140, 144, 150, 158, 165, 170, 168],
    competition: 'Medium',
  },
}

const TRENDING_CROPS = [
  { name: 'Tomatoes',  icon: '🍅', demand: 'Very High', price: 'KES 145/kg', change: '+20.8%', up: true },
  { name: 'Avocados',  icon: '🥑', demand: 'Very High', price: 'KES 185/kg', change: '+23.3%', up: true },
  { name: 'Potatoes',  icon: '🥔', demand: 'High',      price: 'KES 68/kg',  change: '+23.6%', up: true },
  { name: 'Beans',     icon: '🫘', demand: 'High',      price: 'KES 170/kg', change: '+13.3%', up: true },
  { name: 'Eggs',      icon: '🥚', demand: 'High',      price: 'KES 560/tray', change: '+12%', up: true },
  { name: 'Maize',     icon: '🌽', demand: 'High',      price: 'KES 52/kg',  change: '+15.6%', up: true },
  { name: 'Mangoes',   icon: '🥭', demand: 'Medium',    price: 'KES 65/kg',  change: '-18.8%', up: false },
  { name: 'Sukuma',    icon: '🥬', demand: 'Medium',    price: 'KES 30/bundle', change: '0%',  up: null },
]

const DEMAND_COLOR = {
  'Very High': 'bg-green-100 text-green-800 border-green-200',
  'High':      'bg-blue-100 text-blue-800 border-blue-200',
  'Medium':    'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Low':       'bg-red-100 text-red-800 border-red-200',
}

const COMPETITION_COLOR = {
  'Low':       'text-green-600',
  'Medium':    'text-yellow-600',
  'High':      'text-red-500',
  'Very High': 'text-red-700',
}

// Simple sparkline component
function Sparkline({ data, up }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 120
  const height = 40
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={up === false ? '#ef4444' : up === null ? '#94a3b8' : '#22c55e'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((v - min) / range) * height
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="3" fill={up === false ? '#ef4444' : up === null ? '#94a3b8' : '#22c55e'} />
        ) : null
      })}
    </svg>
  )
}

export default function MarketAI() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected]   = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult]       = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [])

  const handleAnalyze = async (cropName) => {
    setSelected(cropName)
    setAnalyzing(true)
    setResult(null)
    // Simulate AI analysis delay
    await new Promise((r) => setTimeout(r, 1800))
    setResult(MARKET_DATA[cropName])
    setAnalyzing(false)
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 mb-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🤖</span>
            <div>
              <h1 className="font-display text-2xl font-bold">Market Intelligence AI</h1>
              <p className="text-green-200 text-sm">Powered by Farm2Feed Analytics Engine v1.0</p>
            </div>
          </div>
          <p className="text-green-100 text-sm mt-2 max-w-2xl">
            Get AI-powered demand predictions, price suggestions, and market insights to help you sell smarter and earn more.
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            {['📈 Price Forecasting', '🌍 Demand Prediction', '⏰ Best Sell Time', '💡 Market Insights'].map((f) => (
              <span key={f} className="bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 mb-6">
        {[
          { id: 'overview', label: 'Market Overview', icon: '📊' },
          { id: 'predict',  label: 'Analyze Crop',    icon: '🔍' },
          { id: 'tips',     label: 'Farming Tips',    icon: '💡' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-green-700 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📈', label: 'Crops with High Demand', value: '6', sub: 'This week' },
              { icon: '💰', label: 'Avg Price Increase',     value: '+15%', sub: 'Across all crops' },
              { icon: '🌍', label: 'Markets Monitored',      value: '47', sub: 'Counties' },
              { icon: '🕐', label: 'Last Updated',           value: 'Today', sub: '8:00 AM EAT' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-bold text-gray-800 text-xl">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Trending crops table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display text-lg text-gray-800">Live Market Prices & Demand</h2>
              <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                Live
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Crop', 'Demand', 'Current Price', 'AI Suggested', 'Change', '7-Day Trend', 'Action'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TRENDING_CROPS.map((crop) => {
                    const data = MARKET_DATA[crop.name]
                    return (
                      <tr key={crop.name} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{crop.icon}</span>
                            <span className="font-semibold text-gray-800">{crop.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge border text-xs ${DEMAND_COLOR[crop.demand]}`}>
                            {crop.demand}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 font-medium">{crop.price}</td>
                        <td className="px-4 py-3 font-bold text-green-700">
                          {data ? `KES ${data.suggestedPrice}/${data.currentPrice === 500 ? 'tray' : data.currentPrice === 800 ? '500ml' : data.unit || 'kg'}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-sm ${
                            crop.up === true ? 'text-green-600' : crop.up === false ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {crop.up === true ? '↑' : crop.up === false ? '↓' : '→'} {crop.change}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {data && <Sparkline data={data.forecast} up={crop.up} />}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { setActiveTab('predict'); handleAnalyze(crop.name) }}
                            className="text-xs text-green-700 font-semibold border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Analyze →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">Market Alert — Mango Season Oversupply</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Mango prices are expected to fall 18–25% over the next 4 weeks due to peak harvest season along the coast and Eastern regions.
                If you grow mangoes, consider drying, juicing, or exporting to avoid low farm gate prices.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ANALYZE TAB ── */}
      {activeTab === 'predict' && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="font-display text-lg text-gray-800 mb-1">Select a Crop to Analyze</h2>
            <p className="text-gray-400 text-sm mb-5">
              Our AI will predict demand, suggest the best price, and tell you the optimal time to sell.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {TRENDING_CROPS.map((crop) => (
                <button
                  key={crop.name}
                  onClick={() => handleAnalyze(crop.name)}
                  className={`p-4 rounded-xl border-2 text-center transition-all hover:border-green-400 hover:bg-green-50 ${
                    selected === crop.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-1">{crop.icon}</div>
                  <div className="text-xs font-semibold text-gray-700">{crop.name}</div>
                </button>
              ))}
            </div>

            {analyzing && (
              <div className="text-center py-10">
                <Spinner size="lg" />
                <p className="text-green-600 font-medium mt-4 animate-pulse-slow">
                  AI is analyzing market data for {selected}...
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Processing price history, demand signals, and seasonal trends
                </p>
              </div>
            )}
          </div>

          {/* AI Result */}
          {result && !analyzing && (
            <div className="animate-scale-in space-y-4">
              {/* Score card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">AI ANALYSIS RESULT</p>
                    <h2 className="font-display text-2xl text-gray-800">{selected}</h2>
                    <p className="text-gray-400 text-sm">Market Intelligence Report · {new Date().toLocaleDateString('en-KE')}</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                      result.demandScore >= 80 ? 'border-green-400 bg-green-50 text-green-700' :
                      result.demandScore >= 60 ? 'border-yellow-400 bg-yellow-50 text-yellow-700' :
                                                 'border-red-400 bg-red-50 text-red-700'
                    }`}>
                      {result.demandScore}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Demand Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Demand */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-medium mb-2">MARKET DEMAND</p>
                    <span className={`badge border text-sm px-3 py-1 ${DEMAND_COLOR[result.demand]}`}>
                      {result.demand}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">Competition: <span className={`font-semibold ${COMPETITION_COLOR[result.competition]}`}>{result.competition}</span></p>
                  </div>

                  {/* Price */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-medium mb-2">PRICE SUGGESTION</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-700">KES {result.suggestedPrice}</span>
                      <span className={`text-sm font-bold ${result.trend === 'up' ? 'text-green-600' : result.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                        {result.priceChange}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Current market: KES {result.currentPrice}</p>
                  </div>

                  {/* Timing */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-medium mb-2">BEST SELL TIME</p>
                    <p className="text-sm font-semibold text-gray-800">{result.bestTime}</p>
                  </div>
                </div>
              </div>

              {/* Price forecast chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display text-lg text-gray-800 mb-1">7-Day Price Forecast</h3>
                <p className="text-gray-400 text-xs mb-5">Predicted price movement (KES)</p>
                <div className="flex items-end gap-2 h-32">
                  {result.forecast.map((price, i) => {
                    const max = Math.max(...result.forecast)
                    const min = Math.min(...result.forecast)
                    const range = max - min || 1
                    const heightPct = ((price - min) / range) * 80 + 20
                    const isLast = i === result.forecast.length - 1
                    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500 font-medium">{price}</span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-700 ${
                            isLast ? 'bg-green-500' : 'bg-green-200'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-xs text-gray-400">{days[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AI Insight */}
              <div className={`rounded-2xl p-5 border ${
                result.trend === 'up' ? 'bg-green-50 border-green-200' :
                result.trend === 'down' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {result.trend === 'up' ? '📈' : result.trend === 'down' ? '📉' : '📊'}
                  </span>
                  <div>
                    <h3 className={`font-semibold mb-1 ${
                      result.trend === 'up' ? 'text-green-800' :
                      result.trend === 'down' ? 'text-red-800' : 'text-gray-800'
                    }`}>
                      AI Market Insight
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      result.trend === 'up' ? 'text-green-700' :
                      result.trend === 'down' ? 'text-red-700' : 'text-gray-600'
                    }`}>
                      {result.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/dashboard/farmer')}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  + List {selected} at KES {result.suggestedPrice}
                </button>
                <button
                  onClick={() => { setResult(null); setSelected(null) }}
                  className="btn-secondary flex-1 sm:flex-none"
                >
                  Analyze Another Crop
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TIPS TAB ── */}
      {activeTab === 'tips' && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-lg text-gray-800 mb-4">AI Farming Recommendations</h2>
            <div className="space-y-4">
              {[
                {
                  icon: '🌱',
                  title: 'Plant Tomatoes & Avocados This Season',
                  body: 'Both crops show strong demand signals for the next 3 months. Tomato demand is up 40% from urban restaurants and hotels. Avocado export windows to Europe are open.',
                  tag: 'High Priority',
                  tagColor: 'bg-green-100 text-green-700',
                },
                {
                  icon: '💧',
                  title: 'Irrigate — Dry Season Ahead',
                  body: 'Weather models predict below-average rainfall in the next 6 weeks across Central and Rift Valley. Farmers with irrigation access have a competitive advantage.',
                  tag: 'Weather Alert',
                  tagColor: 'bg-blue-100 text-blue-700',
                },
                {
                  icon: '📦',
                  title: 'Reduce Mango Production for Next Season',
                  body: 'Mango market is oversupplied. Prices are falling 18–25%. Consider diversifying to passion fruits or citrus, which show 30% higher profit margins this season.',
                  tag: 'Market Advisory',
                  tagColor: 'bg-amber-100 text-amber-700',
                },
                {
                  icon: '🤝',
                  title: 'Group Selling for Better Prices',
                  body: 'Individual farmers selling maize get KES 42–45/kg. Farmer groups selling collectively to millers get KES 52–58/kg. Consider joining or forming a cooperative.',
                  tag: 'Strategy Tip',
                  tagColor: 'bg-purple-100 text-purple-700',
                },
                {
                  icon: '🏭',
                  title: 'Value Addition Opportunity — Beans',
                  body: 'Cleaned, sorted, and packaged beans sell at KES 220–250/kg vs KES 150/kg raw. Simple processing at farm level can boost your income by 50%.',
                  tag: 'Income Boost',
                  tagColor: 'bg-green-100 text-green-700',
                },
                {
                  icon: '📱',
                  title: 'Sell Directly — Skip Middlemen',
                  body: 'Middlemen take 30–40% of farm gate prices. Using Farm2Feed to sell directly to consumers in Nairobi, Mombasa, and Kisumu can increase your net income significantly.',
                  tag: 'Platform Tip',
                  tagColor: 'bg-green-100 text-green-700',
                },
              ].map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-green-200 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-800 text-sm">{tip.title}</h3>
                      <span className={`badge text-xs ${tip.tagColor}`}>{tip.tag}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
