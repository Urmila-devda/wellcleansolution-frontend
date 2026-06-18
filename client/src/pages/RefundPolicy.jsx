import React from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiAlertTriangle, FiRefreshCw, FiClock, FiCheckSquare } from "react-icons/fi"

export default function RefundPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        {/* Page Title */}
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-850 tracking-tight">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: June 2026 | Well Clean Solutions
          </p>
        </div>

        {/* Introduction Warning Card */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-550 flex items-center justify-center text-xl flex-shrink-0">
            <FiAlertTriangle />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">Important Notice</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Please review our cancellation and return request policies below carefully. All return submissions are subject to manual verification by our administration team.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* 1. Cancellation Policy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">1. Cancellation Policy</h2>
            </div>
            <ul className="list-disc pl-6 text-xs text-slate-500 leading-relaxed space-y-2 font-semibold">
              <li>Orders once placed <span className="text-slate-850 font-bold">cannot be cancelled</span> under any circumstances.</li>
              <li>Cancellation or return requests will not be accepted while the package is in transit or prior to delivery.</li>
            </ul>
          </div>

          {/* 2. Refund and Return Policy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-green rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">2. Returns & Refunds Scope</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Refunds, returns, or product replacements are only offered if the product delivered is:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-650 font-bold pl-2">
              <li className="flex items-center gap-2">🟢 Damaged Product</li>
              <li className="flex items-center gap-2">🟢 Defective Product</li>
              <li className="flex items-center gap-2">🟢 Leaked Bottle Packaging</li>
              <li className="flex items-center gap-2">🟢 Wrong Product Delivered</li>
            </ul>
          </div>

          {/* 3. Strict 24-Hour Return Submission Window */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">3. Timeframes & Image Requirements</h2>
            </div>
            <ul className="list-disc pl-6 text-xs text-slate-500 leading-relaxed space-y-2 font-semibold">
              <li>Customers must submit a return or refund request <span className="text-slate-850 font-bold">within 24 hours of delivery</span>.</li>
              <li>Clear images showing the damaged item, leaks, or product labels of the defective item are mandatory. Claims without images or requests submitted after 24 hours from delivery will be rejected.</li>
            </ul>
          </div>

          {/* 4. Verification and Processing time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-purple-550 rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">4. Processing & Timelines</h2>
            </div>
            <ul className="list-disc pl-6 text-xs text-slate-500 leading-relaxed space-y-2 font-semibold">
              <li>All claims undergo manual review. Verification may take up to 2-3 business days.</li>
              <li>Once approved, refunds will be processed and credited to the original payment method (e.g. UPI, NetBanking, Card) within <span className="text-slate-850 font-bold">7–10 business days</span>.</li>
            </ul>
          </div>

        </div>

        {/* Process Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-semibold">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center text-sm mx-auto">
              <FiClock />
            </div>
            <h4 className="text-xs font-bold text-slate-850">1. Apply within 24h</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Submit your request with order details and photos.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center text-sm mx-auto">
              <FiCheckSquare />
            </div>
            <h4 className="text-xs font-bold text-slate-850">2. Manual Review</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Our admin verifies images and checks the claim genuineness.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center text-sm mx-auto">
              <FiRefreshCw />
            </div>
            <h4 className="text-xs font-bold text-slate-850">3. Fast Refund</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Approved refunds appear in original payment mode in 7-10 days.</p>
          </div>
        </div>

        {/* File return request button link */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate("/return-request")}
            className="px-8 py-3.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-hover transition-all shadow-md shadow-brand-blue/20 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Go to Return Request Form</span>
          </button>
        </div>

      </div>
    </div>
  )
}
