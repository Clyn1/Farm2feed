// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-7xl mb-4">🌾</div>
        <h1 className="font-display text-4xl text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Oops! This page seems to have gone back to the farm.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  )
}
