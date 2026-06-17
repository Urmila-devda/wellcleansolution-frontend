import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FiAlertTriangle, FiArrowLeft, FiShoppingCart } from "react-icons/fi"

export default function PaymentFailed() {
  const location = useLocation()
  const navigate = useNavigate()

  // Extract failure details passed via navigation state
  const { reason } = location.state || {
    reason: "Transaction was declined by the bank or cancelled.",
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center animate-fade-in-up">
        {/* Warning/Failure Icon */}
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner animate-pulse-subtle">
          <FiAlertTriangle className="stroke-[2px]" />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-black text-slate-800 mb-1">Payment Failed</h2>
        <p className="text-xs text-slate-400 font-semibold mb-6">Your transaction could not be processed at this moment.</p>

        {/* Reason card */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 mb-8 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-500 mb-1.5">Failure Reason</h4>
          <p className="text-xs text-slate-650 leading-relaxed font-semibold">
            {reason}
          </p>
        </div>

        {/* Note */}
        <p className="text-[11px] text-slate-450 leading-normal mb-8 font-semibold">
          No charges were deducted from your account. If amount got debited, it will be refunded back to your bank within 3-5 business days automatically.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-hover transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Retry Payment</span>
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiShoppingCart className="text-sm" />
            <span>Return to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}
