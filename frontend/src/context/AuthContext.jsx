// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, restore user from localStorage if token exists
  useEffect(() => {
    try {
      const storedUser  = localStorage.getItem('f2f_user')
      const storedToken = localStorage.getItem('f2f_token')
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
      }
    } catch (_) {
      localStorage.removeItem('f2f_user')
      localStorage.removeItem('f2f_token')
    } finally {
      setLoading(false)
    }
  }, [])

  // Called after successful login or register
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('f2f_user', JSON.stringify(userData))
  }

  // Called on logout
  const logout = () => {
    authService.logout() // clears localStorage
    setUser(null)
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