// src/pages/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Spinner from '../components/Spinner.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'consumer' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await authService.register(form.name, form.email, form.password, form.role)
      login(user)
      showToast(`Welcome to Farm2Feed, ${user.name}! 🎉`, 'success')
      navigate(user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-green-50/60 px-4 py-10">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-700" />
          <div className="p-8">
            <div className="text-center mb-7">
              <div className="text-4xl mb-3">🌾</div>
              <h1 className="font-display text-2xl text-gray-800 mb-1">Join Farm2Feed</h1>
              <p className="text-gray-400 text-sm">Create your free account today</p>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <label className="form-label">I AM A...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: 'consumer', emoji: '🛍️', label: 'Consumer', desc: 'Browse & buy fresh produce' },
                  { role: 'farmer', emoji: '🧑‍🌾', label: 'Farmer', desc: 'Sell your harvest online' },
                ].map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => set('role', r.role)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all duration-150 ${
                      form.role === r.role
                        ? 'border-green-500 bg-green-50 shadow-sm'
                        : 'border-gray-200 hover:border-green-200 hover:bg-green-50/40'
                    }`}
                  >
                    <div className="text-3xl mb-1">{r.emoji}</div>
                    <div className="font-semibold text-sm text-gray-800">{r.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">FULL NAME</label>
                <input
                  className="form-input"
                  placeholder="John Kamau"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? (
                  <><Spinner size="sm" color="white" /> Creating account...</>
                ) : (
                  `Create ${form.role === 'farmer' ? 'Farmer' : 'Consumer'} Account`
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 font-semibold hover:text-green-800">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
