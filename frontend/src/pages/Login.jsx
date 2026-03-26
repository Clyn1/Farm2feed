// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Spinner from '../components/Spinner.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const { user } = await authService.login(email, password)
      login(user)
      showToast(`Welcome back, ${user.name}! 👋`, 'success')
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
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-700" />

          <div className="p-8">
            <div className="text-center mb-7">
              <div className="text-4xl mb-3">🌱</div>
              <h1 className="font-display text-2xl text-gray-800 mb-1">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to your Farm2Feed account</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label">PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading ? <><Spinner size="sm" color="white" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 font-semibold hover:text-green-800">
                Create one
              </Link>
            </div>

            {/* Demo hint */}
            <div className="mt-5 bg-green-50 rounded-xl p-3 border border-green-100">
              <p className="text-xs text-green-700 font-medium mb-1">💡 Demo tip</p>
              <p className="text-xs text-green-600">
                Use any email with <strong>farmer</strong> in it (e.g.{' '}
                <button
                  type="button"
                  className="underline hover:text-green-800"
                  onClick={() => { setEmail('john@farmer.com'); setPassword('password') }}
                >
                  john@farmer.com
                </button>
                ) to login as a Farmer, or any other email for Consumer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
