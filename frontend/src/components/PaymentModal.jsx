// src/components/PaymentModal.jsx
import { useState } from 'react'
import { paymentService } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import Spinner from './Spinner.jsx'

const STEPS = { FORM: 'form', PROCESSING: 'processing', SUCCESS: 'success', FAILED: 'failed' }

export default function PaymentModal({ product, onClose, onSuccess }) {
  const [step, setStep] = useState(STEPS.FORM)
  const [phone, setPhone] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const { showToast } = useToast()

  const handlePay = async () => {
    if (!phone || phone.replace(/\s/g, '').length < 10) {
      setErrMsg('Please enter a valid phone number (e.g. 0712 345 678).')
      return
    }
    setErrMsg('')
    setStep(STEPS.PROCESSING)
    try {
      const txn = await paymentService.initiateStkPush(phone, product.price, product.name)
      setTransaction(txn)
      setStep(STEPS.SUCCESS)
      showToast('Payment received! 🎉', 'success')
      onSuccess && onSuccess(txn)
    } catch (err) {
      setStep(STEPS.FAILED)
      showToast('Payment failed. Please try again.', 'error')
    }
  }

  // Prevent background clicks from closing during processing
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && step !== STEPS.PROCESSING) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in overflow-hidden">

        {/* FORM STEP */}
        {step === STEPS.FORM && (
          <div>
            {/* M-Pesa Header */}
            <div className="bg-[#00a651] px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">📱</div>
              <div>
                <div className="text-white font-black text-lg tracking-tight">M-PESA</div>
                <div className="text-white/80 text-xs">Safaricom Mobile Money</div>
              </div>
            </div>

            <div className="p-5">
              <h2 className="font-display text-xl text-gray-800 mb-1">Complete Payment</h2>
              <p className="text-gray-500 text-sm mb-4">
                An STK push will be sent to your phone. Enter your M-Pesa PIN to confirm.
              </p>

              {/* Amount display */}
              <div className="bg-green-50 rounded-xl px-4 py-3 flex items-center justify-between mb-4 border border-green-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Amount to Pay</p>
                  <p className="text-xs text-gray-400 mt-0.5">For: {product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-700 font-bold text-xl">KES {product.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Phone input */}
              <div className="mb-4">
                <label className="form-label">MPESA PHONE NUMBER</label>
                <input
                  type="tel"
                  placeholder="e.g. 0712 345 678"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrMsg('') }}
                  className="form-input"
                  autoFocus
                />
                {errMsg && <p className="text-red-500 text-xs mt-1.5">{errMsg}</p>}
              </div>

              <div className="flex gap-3">
                <button onClick={handlePay} className="btn-primary flex-1">
                  Pay KES {product.price.toLocaleString()}
                </button>
                <button onClick={onClose} className="btn-ghost text-gray-500 px-3">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROCESSING STEP */}
        {step === STEPS.PROCESSING && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <Spinner size="lg" />
            </div>
            <h3 className="font-display text-xl text-gray-800 mb-2">Processing Payment...</h3>
            <p className="text-gray-500 text-sm mb-4">
              Check your phone for the M-Pesa PIN prompt.
            </p>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === STEPS.SUCCESS && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-scale-in">
              ✅
            </div>
            <h3 className="font-display text-2xl text-gray-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-500 text-sm mb-5">
              Your payment of <strong>KES {product.price.toLocaleString()}</strong> for{' '}
              <strong>{product.name}</strong> has been received.
            </p>

            {transaction && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left mb-5">
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-gray-500">Order Status</span>
                  <span className="font-semibold text-green-700 text-right">✓ Paid</span>
                  <span className="text-gray-500">Reference</span>
                  <span className="font-semibold text-gray-800 text-right">{transaction.transactionId}</span>
                  <span className="text-gray-500">Time</span>
                  <span className="font-semibold text-gray-800 text-right">{transaction.timestamp}</span>
                </div>
              </div>
            )}

            <button onClick={onClose} className="btn-primary w-full">
              Done
            </button>
          </div>
        )}

        {/* FAILED STEP */}
        {step === STEPS.FAILED && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-scale-in">
              ❌
            </div>
            <h3 className="font-display text-2xl text-gray-800 mb-2">Payment Failed</h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't process your payment. Please check your M-Pesa balance and try again.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep(STEPS.FORM)} className="btn-primary flex-1">
                Try Again
              </button>
              <button onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}