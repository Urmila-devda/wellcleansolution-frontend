import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ordersAPI } from "../services/api"
import { getProductImage } from "../utils/imageMapper"
import { FiClock, FiFileText } from "react-icons/fi"

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await ordersAPI.getMyOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to load orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🟡 Pending</span>
      case "Confirmed":
        return <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🔵 Confirmed</span>
      case "Processing":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🔵 Processing</span>
      case "Shipped":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🟣 Shipped</span>
      case "Delivered":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🟢 Delivered</span>
      case "Cancelled":
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full">🔴 Cancelled</span>
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FiFileText className="text-brand-blue text-2xl" />
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Order History</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all shadow-sm"
          >
            Back to Shop
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <svg className="animate-spin h-8 w-8 text-brand-blue mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-semibold text-slate-400">Loading your purchase records...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <FiClock />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No orders yet</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">Once you check out, you'll be able to view and track your eco-friendly orders right here.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-full text-xs font-bold hover:bg-brand-blue-hover transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-200 transition-all duration-300"
              >
                
                {/* Order Item Header */}
                <div className="bg-slate-50/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 text-xs font-semibold text-slate-500">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Date Placed</p>
                      <p className="text-slate-700 mt-0.5">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Charge</p>
                      <p className="text-brand-blue font-bold mt-0.5">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Order Reference</p>
                      <p className="text-slate-700 font-mono text-[10px] mt-1 bg-slate-100 px-2 py-0.5 rounded">{order._id}</p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 flex-shrink-0">
                          <img
                            src={getProductImage(item.image)}
                            alt={item.name}
                            className="max-h-10 max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {item.quantity} &times; ₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping info footer */}
                <div className="bg-slate-50/20 px-6 py-3 border-t border-slate-100 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500">Shipping To:</span>
                    <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</span>
                  </div>
                  {order.orderStatus === "Delivered" && (
                    <button
                      onClick={() => navigate(`/return-request?orderNumber=${order.orderNumber || order._id}`)}
                      className="px-3 py-1.5 bg-brand-soft-blue text-brand-blue hover:bg-brand-blue hover:text-white rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all cursor-pointer border-0"
                    >
                      Request Return/Refund
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
