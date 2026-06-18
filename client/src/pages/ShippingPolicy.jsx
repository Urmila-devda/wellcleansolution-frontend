import React from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiTruck, FiMap, FiPackage } from "react-icons/fi"

export default function ShippingPolicy() {
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
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: June 2026 | Well Clean Solutions
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-xs text-slate-500 leading-relaxed font-semibold">

          <p>
            Well Clean Solutions provides professional-grade cleaning products shipped safely across regions. We partner with reliable delivery and courier logistics agencies to ensure packages arrive promptly and safely.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">1. Shipping Zones & Dispatch</h2>
            </div>
            <p>
              We ship products to valid postal pin codes across India. Orders are processed and dispatched within 1-2 business days from our manufacturing warehouse located in Thane, Maharashtra.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-green rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">2. Delivery Timeframes</h2>
            </div>
            <p>
              Estimated delivery times depend on your region:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><span className="text-slate-800">Thane & Mumbai Metro:</span> 1 - 3 business days.</li>
              <li><span className="text-slate-800">Rest of Maharashtra & Metro Cities:</span> 3 - 5 business days.</li>
              <li><span className="text-slate-800">Other regions:</span> 5 - 7 business days.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">3. Shipping Rates</h2>
            </div>
            <p>
              Shipping fees are calculated at checkout based on order value. For orders above ₹99, shipping is free. For orders under ₹99, a standard shipping fee is applied to cover delivery logistics.
            </p>
          </div>

        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-semibold">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center text-sm mx-auto">
              <FiTruck />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Prompt Dispatch</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Packages leave our Thane facility within 24–48 hours from order placement.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-green flex items-center justify-center text-sm mx-auto">
              <FiMap />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Nationwide Tracking</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Track your shipment details online once items are shipped.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-amber-500 flex items-center justify-center text-sm mx-auto">
              <FiPackage />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Safe Packing</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Concentrate bottles are securely sealed to prevent leakage during transit.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
