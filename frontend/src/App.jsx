// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import ConsumerDashboard from './pages/ConsumerDashboard.jsx'
import NotFound from './pages/NotFound.jsx'

// Protected route — redirects to login if not authenticated
function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to correct dashboard if wrong role
    return <Navigate to={user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer'} replace />
  }
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetail />} />
          <Route
            path="/dashboard/farmer"
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/consumer"
            element={
              <ProtectedRoute requiredRole="consumer">
                <ConsumerDashboard />
              </ProtectedRoute>
            }
          />
          {/* Legacy /dashboard redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

function DashboardRedirect() {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}