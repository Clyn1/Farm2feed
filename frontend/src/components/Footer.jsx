// src/components/Footer.jsx
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="bg-green-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-xl font-bold mb-3 flex items-center gap-2">
            <span>🌱</span> Farm2Feed
          </div>
          <p className="text-green-200/70 text-sm leading-relaxed">
            Connecting farmers and consumers across Kenya. Fresh produce, fair prices, sustainable agriculture.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3">Platform</div>
          {['Products', 'For Farmers', 'AI Crop Doctor', 'M-Pesa Payments'].map((l) => (
            <p key={l} className="text-green-200/70 text-sm mb-2 hover:text-white cursor-pointer transition-colors">{l}</p>
          ))}
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3">Company</div>
          {['About Us', 'Blog', 'Careers', 'Contact'].map((l) => (
            <p key={l} className="text-green-200/70 text-sm mb-2 hover:text-white cursor-pointer transition-colors">{l}</p>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <p className="text-green-300/50 text-xs">© 2025 Farm2Feed. Made with ❤️ for Kenyan farmers.</p>
        <p className="text-green-300/50 text-xs">Prototype v1.0</p>
      </div>
    </footer>
  )
}
