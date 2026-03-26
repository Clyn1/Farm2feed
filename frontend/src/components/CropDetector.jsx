// src/components/CropDetector.jsx
import { useState, useRef } from 'react'
import { aiService } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import Spinner from './Spinner.jsx'

const SEVERITY_COLORS = {
  None:     'bg-green-100 text-green-800 border-green-200',
  Low:      'bg-yellow-100 text-yellow-800 border-yellow-200',
  Moderate: 'bg-orange-100 text-orange-800 border-orange-200',
  High:     'bg-red-100 text-red-800 border-red-200',
}

export default function CropDetector() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [confidenceVisible, setConfidenceVisible] = useState(false)
  const fileRef = useRef()
  const { showToast } = useToast()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file.', 'error')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setConfidenceVisible(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!image) {
      showToast('Please upload a crop image first.', 'error')
      return
    }
    setAnalyzing(true)
    setResult(null)
    setConfidenceVisible(false)
    try {
      const data = await aiService.analyzeImage(image)
      setResult(data)
      // Slight delay to animate confidence bar
      setTimeout(() => setConfidenceVisible(true), 200)
      showToast('Analysis complete!', 'success')
    } catch (err) {
      showToast('Analysis failed. Please try again.', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setConfidenceVisible(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const severityColor = result ? SEVERITY_COLORS[result.severity] || SEVERITY_COLORS.Low : ''
  const isHealthy = result?.severity === 'None'

  return (
    <div className="space-y-5">
      {/* Upload Zone */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!preview ? (
        <div
          className="upload-zone border-2 border-dashed border-green-200 rounded-2xl p-10 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 bg-green-50/30"
          onClick={() => fileRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="text-5xl mb-3">🌿</div>
          <p className="font-semibold text-gray-700 mb-1">Upload a crop image</p>
          <p className="text-sm text-gray-400">Click to browse or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP supported</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={preview}
            alt="Crop preview"
            className="w-full max-h-72 object-cover"
          />
          <button
            onClick={handleReset}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {image?.name}
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!image || analyzing}
        className="btn-primary w-full py-3 text-base"
      >
        {analyzing ? (
          <>
            <Spinner size="sm" color="white" />
            Analyzing with AI...
          </>
        ) : (
          <>🔍 Analyze Crop</>
        )}
      </button>

      {/* Analyzing Status */}
      {analyzing && (
        <div className="text-center animate-pulse-slow">
          <p className="text-sm text-green-600 font-medium">
            CropDetect AI v2.1 is scanning for diseases...
          </p>
        </div>
      )}

      {/* AI Result */}
      {result && (
        <div className="animate-scale-in rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Result header */}
          <div className={`px-5 py-3 flex items-center justify-between ${isHealthy ? 'bg-green-600' : 'bg-gray-800'}`}>
            <div className="flex items-center gap-2 text-white">
              <span>🤖</span>
              <span className="font-semibold text-sm">AI Analysis Complete</span>
            </div>
            <span className="text-white/70 text-xs">CropDetect v2.1 · {result.analyzedAt}</span>
          </div>

          <div className="p-5 space-y-4 bg-white">
            {/* Disease name */}
            <div>
              <p className="form-label">DISEASE DETECTED</p>
              <p className="font-display text-lg text-gray-800 font-semibold">{result.disease}</p>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="form-label">CONFIDENCE LEVEL</p>
                <span className="text-green-700 font-bold text-sm">{result.confidence}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full confidence-bar-fill transition-all ${
                    result.confidence >= 85 ? 'bg-green-500' : result.confidence >= 65 ? 'bg-yellow-400' : 'bg-orange-400'
                  }`}
                  style={{ width: confidenceVisible ? `${result.confidence}%` : '0%' }}
                />
              </div>
            </div>

            {/* Severity */}
            <div className="flex items-center gap-3">
              <p className="form-label mb-0">SEVERITY</p>
              <span className={`badge border ${severityColor} text-xs`}>{result.severity}</span>
            </div>

            {/* Treatment */}
            <div>
              <p className="form-label">RECOMMENDED TREATMENT</p>
              <div className={`rounded-xl p-4 border-l-4 ${isHealthy ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-400'}`}>
                <p className={`text-sm leading-relaxed ${isHealthy ? 'text-green-800' : 'text-amber-900'}`}>
                  {result.treatment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
