// src/components/Navbar.jsx
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardPath = isLoggedIn
    ? user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer'
    : '/login'

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-green-100 text-green-800'
        : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
    }`

  const navLinks = [
    { to: '/',         label: 'Home',      end: true },
    { to: '/products', label: 'Products' },
    { to: dashboardPath, label: 'Dashboard' },
    ...(isLoggedIn && user.role === 'consumer'
      ? [{ to: '/my-orders', label: 'My Orders' }]
      : []),
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* Brand */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-display text-xl font-bold text-green-700 hover:text-green-800 transition-colors flex-shrink-0"
        >
          <span className="text-2xl">🌱</span>
          <span className="hidden sm:block">Farm2Feed</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* AI Market Button — visible to farmers only, top-right */}
          {isLoggedIn && user.role === 'farmer' && (
            <button
              onClick={() => navigate('/market-ai')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-bold rounded-lg shadow-sm hover:from-green-700 hover:to-green-600 transition-all hover:shadow-md active:scale-95 flex-shrink-0"
              title="AI Market Intelligence"
            >
              <span>🤖</span>
              <span className="hidden sm:block">Market AI</span>
            </button>
          )}

          {/* Auth section — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-green-800 max-w-[100px] truncate capitalize">
                    {user.name}
                  </span>
                  <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full font-semibold capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-green-700 px-3 py-1.5 rounded-lg transition-all">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm px-4 py-2">
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive ? 'bg-green-50 text-green-800' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* AI button in mobile menu for farmers */}
          {isLoggedIn && user.role === 'farmer' && (
            <button
              onClick={() => { navigate('/market-ai'); setMobileOpen(false) }}
              className="px-4 py-3 rounded-xl text-base font-medium text-left text-green-700 hover:bg-green-50 transition-all flex items-center gap-2"
            >
              🤖 Market AI
            </button>
          )}

          <div className="mt-2 pt-2 border-t border-gray-100">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => { navigate('/login'); setMobileOpen(false) }} className="btn-secondary w-full justify-center">Sign In</button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false) }} className="btn-primary w-full justify-center">Get Started</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
