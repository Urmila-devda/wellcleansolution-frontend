import React, { useState } from "react"
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiCheckCircle } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"

export default function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  const [isLoginTab, setIsLoginTab] = useState(true)
  
  // Fields state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  if (!isOpen) return null

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setPhone("")
    setConfirmPassword("")
    setErrorMsg("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    // Form Validations
    if (isLoginTab) {
      const result = await login(email, password)
      setIsLoading(false)
      if (result.success) {
        setSuccessMsg("Welcome back!")
        setTimeout(() => {
          setSuccessMsg("")
          resetForm()
          onClose()
        }, 1500)
      } else {
        setErrorMsg(result.error)
      }
    } else {
      // 1. Password min length
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long")
        setIsLoading(false)
        return
      }

      // 2. Confirm matching
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match")
        setIsLoading(false)
        return
      }

      // 3. Email format regex check
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      if (!emailRegex.test(email)) {
        setErrorMsg("Please enter a valid email address")
        setIsLoading(false)
        return
      }

      const result = await register({ name, email, password, confirmPassword, phone })
      setIsLoading(false)
      if (result.success) {
        setSuccessMsg("Account created successfully!")
        setTimeout(() => {
          setSuccessMsg("")
          resetForm()
          onClose()
        }, 1500)
      } else {
        setErrorMsg(result.error)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          resetForm()
          onClose()
        }}
      />

      {/* Modal Card */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-fade-in-up">
          
          {/* Close Button */}
          <button
            onClick={() => {
              resetForm()
              onClose()
            }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <FiX className="text-xl" />
          </button>

          {successMsg ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-brand-soft-green rounded-full flex items-center justify-center text-brand-green text-3xl mb-4 animate-bounce">
                <FiCheckCircle />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{isLoginTab ? "Login Successful" : "Account Created"}</h3>
              <p className="text-slate-600 text-sm">{successMsg}</p>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(true)
                    setErrorMsg("")
                  }}
                  className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${
                    isLoginTab
                      ? "border-brand-blue text-brand-blue bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(false)
                    setErrorMsg("")
                  }}
                  className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${
                    !isLoginTab
                      ? "border-brand-blue text-brand-blue bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    {isLoginTab ? "Welcome Back" : "Create an Account"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isLoginTab
                      ? "Access your Well Clean Solutions orders and tracking"
                      : "Join us to shop premium eco-cleaning products"}
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-xs font-semibold text-center border border-rose-100 animate-pulse">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {!isLoginTab && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 123-4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                    />
                  </div>
                </div>

                {!isLoginTab && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-hover transition-colors shadow-sm flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>{isLoginTab ? "Sign In" : "Register and Open Account"}</span>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
