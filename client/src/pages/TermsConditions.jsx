import React from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiFile, FiCheckSquare, FiAlertCircle } from "react-icons/fi"

export default function TermsConditions() {
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
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: June 2026 | Well Clean Solutions
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-xs text-slate-500 leading-relaxed font-semibold">
          
          <p>
            Welcome to Well Clean Solutions. By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions. Please read these terms carefully before placing an order.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">1. Product Usage & Catalog</h2>
            </div>
            <p>
              We manufacture professional-grade eco-friendly cleaning concentrates. Products must be diluted and used strictly in accordance with the instructions printed on the packaging. Well Clean Solutions is not liable for damage resulting from misuse or incorrect application.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-green rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">2. Sales, Payments & Pricing</h2>
            </div>
            <p>
              All prices listed are in Indian Rupees (INR). We reserve the right to modify prices and availability without notice. Payments are secured and processed using official third-party payment gateways.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">3. Governing Law</h2>
            </div>
            <p>
              Any disputes or legal proceedings arising out of transactions, website usage, or purchase agreements shall be subject to the exclusive jurisdiction of the competent courts in Thane/Mumbai, Maharashtra, India.
            </p>
          </div>

        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-semibold">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center text-sm mx-auto">
              <FiFile />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Accurate Info</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Ensure all shipping details and order info are correct at checkout.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-green flex items-center justify-center text-sm mx-auto">
              <FiCheckSquare />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Binding Orders</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Once order is submitted, it constitutes a binding contract of sale.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-amber-500 flex items-center justify-center text-sm mx-auto">
              <FiAlertCircle />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Compliance</h4>
            <p className="text-[10px] text-slate-400 leading-normal">All users must comply with local commerce laws when purchasing.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
