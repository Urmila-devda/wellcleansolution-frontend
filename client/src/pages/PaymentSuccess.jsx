import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi"

export default function PaymentSuccess() {
  const location = useLocation()
  const navigate = useNavigate()

  // Extract payment/order information passed via navigation state
  const { orderNumber, paymentId, amount, status } = location.state || {
    orderNumber: "N/A",
    paymentId: "N/A",
    amount: 0,
    status: "Processing",
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center animate-fade-in-up">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner animate-pulse-subtle">
          <FiCheckCircle className="stroke-[2.5px]" />
        </div>

        {/* Success Header */}
        <h2 className="text-2xl font-black text-slate-800 mb-1">✓ Payment Successful</h2>
        <p className="text-xs text-slate-400 font-semibold mb-6">Your transaction was completed and order has been placed.</p>

        {/* Order Details Card */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Order Number</span>
            <span className="text-slate-800 font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded">
              {orderNumber}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Payment ID</span>
            <span className="text-slate-800 font-mono font-bold text-slate-700 truncate max-w-[150px]" title={paymentId}>
              {paymentId}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Amount Paid</span>
            <span className="text-brand-blue font-extrabold text-sm">
              ₹{amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-200/50 pt-2.5">
            <span className="text-slate-400 font-bold">Order Status</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {status}
            </span>
          </div>
        </div>

        {/* Prompt Note */}
        <p className="text-[11px] text-slate-400 leading-normal mb-8 font-semibold">
          An email receipt with full tracking and order delivery details has been dispatched. You can track this order's progress in real-time under your profile.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Orders</span>
            <FiArrowRight className="text-sm" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiShoppingBag className="text-sm" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  )
}
