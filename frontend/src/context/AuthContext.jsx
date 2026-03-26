// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Persist user to sessionStorage for demo convenience
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('f2f_user')
      if (stored) setUser(JSON.parse(stored))
    } catch (_) {}
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    sessionStorage.setItem('f2f_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('f2f_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}