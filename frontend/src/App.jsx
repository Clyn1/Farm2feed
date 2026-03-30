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
import MyOrders from './pages/MyOrders.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import MarketAI from './pages/MarketAI.jsx'
import NotFound from './pages/NotFound.jsx'

function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  )
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer'} replace />
  }
  return children
}

function DashboardRedirect() {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/consumer'} replace />
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"             element={<Home />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Farmer only */}
          <Route path="/dashboard/farmer" element={
            <ProtectedRoute requiredRole="farmer"><FarmerDashboard /></ProtectedRoute>
          } />
          <Route path="/market-ai" element={
            <ProtectedRoute requiredRole="farmer"><MarketAI /></ProtectedRoute>
          } />

          {/* Consumer only */}
          <Route path="/dashboard/consumer" element={
            <ProtectedRoute requiredRole="consumer"><ConsumerDashboard /></ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute requiredRole="consumer"><MyOrders /></ProtectedRoute>
          } />

          {/* Both roles */}
          <Route path="/orders/:orderId" element={
            <ProtectedRoute><OrderTracking /></ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
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
