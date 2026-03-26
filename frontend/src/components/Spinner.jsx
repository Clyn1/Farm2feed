// src/components/Spinner.jsx
export default function Spinner({ size = 'md', color = 'green', label = '' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' }
  const colors = { green: 'border-green-200 border-t-green-600', white: 'border-white/30 border-t-white' }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin-slow`} />
      {label && <p className="text-sm text-gray-500 font-medium">{label}</p>}
    </div>
  )
}