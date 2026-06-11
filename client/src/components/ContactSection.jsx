import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { FiPhone, FiMail, FiClock, FiMapPin, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import { enquiriesAPI } from "../services/api"

export default function ContactSection() {
  const location = useLocation()

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  // Prefill and scroll handler
  useEffect(() => {
    // 1. Check React Router location state
    let scrollTrigger = location.state?.scrollToContact
    let subjectTrigger = location.state?.prefillSubject
    let messageTrigger = location.state?.prefillMessage

    // 2. Fallback to URL search query parameters
    const params = new URLSearchParams(window.location.search)
    const urlSubject = params.get("prefillSubject") || params.get("subject")
    
    if (params.get("scrollToContact") === "true" || urlSubject) {
      scrollTrigger = true
    }
    if (urlSubject) {
      subjectTrigger = urlSubject
    }

    if (scrollTrigger) {
      setTimeout(() => {
        const el = document.getElementById("contact-us")
        el?.scrollIntoView({ behavior: "smooth" })
      }, 200)
    }

    if (subjectTrigger) {
      setFormData((prev) => ({
        ...prev,
        subject: subjectTrigger,
        message: messageTrigger || `Hi, I would like to request a price quote for this cleaning solution. Please contact me with more information.`
      }))
    }
  }, [location.state])

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null) // { type: 'success' | 'error', text: string }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatusMessage(null)

    const { fullName, email, phone, subject, message } = formData

    // 1. Basic validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please complete all fields before sending.",
      })
      setIsSubmitting(false)
      return
    }

    // 2. Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      setStatusMessage({
        type: "error",
        text: "Please provide a valid email address.",
      })
      setIsSubmitting(false)
      return
    }

    // 3. Phone format validation (clean and regex check)
    const phoneCleaned = phone.replace(/\s+/g, "")
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-s./0-9]{6,15}$/
    if (!phoneRegex.test(phoneCleaned)) {
      setStatusMessage({
        type: "error",
        text: "Please provide a valid phone number (minimum 6 digits).",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await enquiriesAPI.submit(formData)
      if (response.data.success) {
        setStatusMessage({
          type: "success",
          text: response.data.message || "Enquiry sent successfully!",
        })
        // Clear form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      }
    } catch (error) {
      console.error("Enquiry submission error:", error)
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact-us" className="py-20 bg-slate-50 font-sans border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
            Help Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Need Help? Contact WellClean
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Have questions about our products or need cleaning solutions for your home or business? Send us your enquiry and our team will contact you.
          </p>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Left Column: Business details card */}
          <div className="lg:w-5/12 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-brand-green/5 rounded-full blur-3xl" />

            <div className="space-y-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Business Information</h3>
                <p className="text-xs text-slate-400">Get in touch directly or view our operating locations.</p>
              </div>

              {/* Details List */}
              <div className="space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-blue text-lg flex-shrink-0 shadow-inner">
                    <FiPhone />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Number</h4>
                    <p className="text-sm font-semibold mt-0.5">+(91) 7021204733</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500 text-lg flex-shrink-0 shadow-inner">
                    <FiMail />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</h4>
                    <p className="text-sm font-semibold mt-0.5">wellclean11@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-green text-lg flex-shrink-0 shadow-inner">
                    <FiClock />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Business Hours</h4>
                    <p className="text-sm font-semibold mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-purple-500 text-lg flex-shrink-0 shadow-inner">
                    <FiMapPin />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Company Office</h4>
                    <p className="text-xs leading-relaxed text-slate-300 mt-0.5">
                      Shed No. 1, Kolshet Khadi, Taricha Pada,<br />
                      Thane West, Maharashtra, 400607
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-8 border-t border-slate-800/80 text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-10 relative z-10">
              🌿 Pure Hygiene, Trusted Germ Defense
            </div>

          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:w-7/12 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Alert Feedback Banner */}
              {statusMessage && (
                <div
                  className={`p-4 rounded-2xl flex items-start gap-3 border text-xs leading-relaxed ${
                    statusMessage.type === "success"
                      ? "bg-brand-soft-green border-brand-green/20 text-brand-green"
                      : "bg-rose-50 border-rose-100 text-rose-800"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <FiCheckCircle className="text-lg flex-shrink-0 mt-0.5" />
                  ) : (
                    <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5" />
                  )}
                  <span className="font-semibold">{statusMessage.text}</span>
                </div>
              )}

              {/* Name & Email fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Phone & Subject fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-500">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 7021204733"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-semibold text-slate-500">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Business query, order inquiry..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-semibold text-slate-500">Detailed Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can our cleaning experts help you?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-medium placeholder-slate-400 resize-none"
                />
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-slate-900 hover:bg-brand-blue text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:hover:bg-slate-900"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending Enquiry...</span>
                  </>
                ) : (
                  <>
                    <FiSend />
                    <span>Send Enquiry</span>
                  </>
                )}
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  )
}
