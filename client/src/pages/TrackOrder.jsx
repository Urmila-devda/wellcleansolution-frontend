import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ordersAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { getProductImage } from "../utils/imageMapper"
import { FiSearch, FiCheck, FiMapPin, FiPhone, FiCreditCard, FiCalendar, FiActivity, FiArrowLeft } from "react-icons/fi"

export default function TrackOrder() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { socket, showToast } = useAuth()

  const [order, setOrder] = useState(null)
  const [searchId, setSearchId] = useState(orderId || "")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setOrder(null)
      setErrorMsg("")
      return
    }

    const fetchOrder = async () => {
      setIsLoading(true)
      setErrorMsg("")
      try {
        const { data } = await ordersAPI.getOne(orderId)
        setOrder(data)
        setSearchId(orderId)
      } catch (error) {
        console.error("Error fetching order details:", error)
        const msg = error.response?.data?.message || "Order not found. Please verify the Order ID."
        setErrorMsg(msg)
        setOrder(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  // Listen for real-time status changes
  useEffect(() => {
    if (!socket || !order?._id) return

    const handleStatusUpdate = (updatedData) => {
      if (updatedData.orderId === order._id) {
        setOrder((prev) => {
          if (!prev) return null
          return {
            ...prev,
            orderStatus: updatedData.orderStatus,
            updatedAt: updatedData.updatedAt
          }
        })
        showToast(`Live Update: Order status updated to ${updatedData.orderStatus}`, "success")
      }
    }

    socket.on("order_status_updated", handleStatusUpdate)

    return () => {
      socket.off("order_status_updated", handleStatusUpdate)
    }
  }, [socket, order?._id, showToast])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchId.trim()) {
      navigate(`/track-order/${searchId.trim()}`)
    }
  }

  const steps = [
    { label: "Placed", statusKey: "Pending" },
    { label: "Processing", statusKey: "Processing" },
    { label: "Shipped", statusKey: "Shipped" },
    { label: "Delivered", statusKey: "Delivered" },
  ]

  const getStepIndex = (status) => {
    switch (status) {
      case "Pending":
      case "Confirmed":
        return 0
      case "Processing":
        return 1
      case "Shipped":
        return 2
      case "Delivered":
        return 3
      case "Cancelled":
        return -1
      default:
        return 0
    }
  }

  const currentStep = getStepIndex(order?.orderStatus || "")

  const getBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Confirmed":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/orders"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors"
          >
            <FiArrowLeft className="text-sm" />
            <span>Back to My Orders</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-brand-green bg-brand-soft-green/60 px-3 py-1 rounded-full border border-brand-green/10">
            <FiActivity className="text-xs animate-pulse" />
            <span>Real-time tracking enabled</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-8">
          {/* Lookup Input panel */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Track Your Order Status</h1>
            <p className="text-xs text-slate-400 mb-6">Enter your Order reference number below to view the shipping journey in real-time.</p>
            
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  required
                  placeholder="Paste your Order ID (e.g. 660f27c8a...)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-slate-800 font-medium placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Track Order
              </button>
            </form>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-brand-blue mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold text-slate-400">Retrieving delivery logs...</span>
            </div>
          )}

          {/* Error panel */}
          {errorMsg && !isLoading && (
            <div className="p-8 text-center py-16">
              <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-xl mx-auto mb-4 border border-rose-100">
                ⚠️
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">Could not track order</h3>
              <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">{errorMsg}</p>
            </div>
          )}

          {/* No Order Selected Panel */}
          {!order && !errorMsg && !isLoading && (
            <div className="p-8 text-center py-20 text-slate-400">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🚚
              </div>
              <h3 className="text-sm font-bold text-slate-600 mb-1">Awaiting Order ID</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Please input your Order Reference key above to launch tracking timeline.</p>
            </div>
          )}

          {/* Track Details Content */}
          {order && !isLoading && (
            <div className="p-8 space-y-8">
              {/* Order Metadata */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-50 pb-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Currently Tracking</span>
                  <h2 className="text-sm font-mono font-bold text-slate-800 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg mt-1 inline-block">
                    {order._id}
                  </h2>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Last Updated</span>
                    <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1 justify-end">
                      <FiCalendar className="text-slate-400" />
                      {new Date(order.updatedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-sans">Status Badge</span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancelled Banner */}
              {order.orderStatus === "Cancelled" && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 px-5 py-4 rounded-2xl flex items-center gap-3 animate-pulse-subtle">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <h4 className="text-xs font-bold">This order has been cancelled</h4>
                    <p className="text-[10px] text-rose-600 mt-0.5">Contact customer support or billing for refund details.</p>
                  </div>
                </div>
              )}

              {/* Progressive Timeline Tracker */}
              {order.orderStatus !== "Cancelled" && (
                <div className="py-8 px-6 bg-slate-50/40 rounded-2xl border border-slate-100">
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                    
                    {/* Desktop Connector Line */}
                    <div className="hidden md:block absolute left-[12%] right-[12%] top-[20px] h-1 bg-slate-200 z-0">
                      <div
                        className="h-full bg-brand-blue transition-all duration-700 ease-out"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      />
                    </div>

                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentStep
                      const isActive = idx === currentStep

                      return (
                        <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 w-full z-10">
                          {/* Circle Milestone indicator */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 border-2 ${
                              isCompleted
                                ? "bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15"
                                : isActive
                                  ? "bg-white border-brand-blue text-brand-blue ring-4 ring-brand-soft-blue animate-pulse"
                                  : "bg-white border-slate-200 text-slate-400"
                            }`}
                          >
                            {isCompleted ? <FiCheck className="text-sm" /> : idx + 1}
                          </div>

                          {/* Descriptive text */}
                          <div className="flex flex-col md:items-center">
                            <span
                              className={`text-xs font-bold ${
                                isActive ? "text-brand-blue" : isCompleted ? "text-slate-800" : "text-slate-400"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              {isActive ? "Currently Here" : isCompleted ? "Completed" : "Scheduled"}
                            </span>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
              )}

              {/* Order Logistics Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Shipping Details */}
                <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Shipping Information</h3>
                  <div className="text-xs space-y-2 text-slate-600 font-semibold">
                    <p className="flex items-start gap-2">
                      <FiMapPin className="text-slate-400 mt-0.5" />
                      <span>
                        {order.shippingAddress.street}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br/>
                        {order.shippingAddress.country}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-slate-400" />
                      <span>{order.shippingAddress.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Payment Details</h3>
                  <div className="text-xs space-y-2 text-slate-600 font-semibold">
                    <p className="flex items-center gap-2">
                      <FiCreditCard className="text-slate-400" />
                      <span>Grand Total: <strong className="text-slate-800 text-sm font-black">₹{order.totalAmount.toFixed(2)}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="pt-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Purchased Items</h3>
                <div className="divide-y divide-slate-50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={getProductImage(item.image)}
                            alt={item.name}
                            className="max-h-10 max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Quantity: {item.quantity} &times; ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
