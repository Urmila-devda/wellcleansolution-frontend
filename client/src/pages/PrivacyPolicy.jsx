import React from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiLock, FiEye, FiServer } from "react-icons/fi"

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: June 2026 | Well Clean Solutions
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-xs text-slate-500 leading-relaxed font-semibold">
          
          <p>
            Well Clean Solutions ("we," "our," or "us") values your privacy. This Privacy Policy details how we collect, use, and safeguard your personal information when you use our website or purchase our eco-friendly cleaning concentrates.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">1. Information We Collect</h2>
            </div>
            <p>
              We collect information that you provide directly to us when you create an account, purchase products, or contact us. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Name and contact information (email address, phone number, physical address).</li>
              <li>Order and delivery information.</li>
              <li>Payment verification details (payment processing handles transaction credentials securely).</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-brand-green rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">2. How We Use Your Data</h2>
            </div>
            <p>
              Your personal information is used to facilitate:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Order fulfillment, package dispatch, and tracking updates.</li>
              <li>Customer service communications and resolving return requests.</li>
              <li>Enhancing website performance and analyzing buying patterns.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
              <h2 className="text-base font-bold text-slate-850">3. Data Security & Storage</h2>
            </div>
            <p>
              We implement industry-standard administrative, technical, and physical measures to protect your personal information from unauthorized access, loss, or alteration. We do not sell or trade your data to third-party advertisers.
            </p>
          </div>

        </div>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-semibold">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-blue flex items-center justify-center text-sm mx-auto">
              <FiLock />
            </div>
            <h4 className="text-xs font-bold text-slate-855">Secure Storage</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Your personal account details are encrypted and securely stored.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-green flex items-center justify-center text-sm mx-auto">
              <FiEye />
            </div>
            <h4 className="text-xs font-bold text-slate-855">No Data Selling</h4>
            <p className="text-[10px] text-slate-400 leading-normal">We never sell, rent, or lease customer databases to marketing firms.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-amber-500 flex items-center justify-center text-sm mx-auto">
              <FiServer />
            </div>
            <h4 className="text-xs font-bold text-slate-855">GDPR & PCI Compliant</h4>
            <p className="text-[10px] text-slate-400 leading-normal">Our store integrations comply with digital transactional standards.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
