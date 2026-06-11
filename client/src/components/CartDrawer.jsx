import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiTag } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import { getProductImage } from "../utils/imageMapper"

export default function CartDrawer({ isOpen, onClose, onOpenLogin }) {
  const { cartItems, updateQty, removeItem, showToast, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [promoCode, setPromoCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0) // percentage
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  if (!isOpen) return null

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (appliedDiscount / 100)
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99
  const total = subtotal - discountAmount + shipping

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError("")
    setPromoSuccess("")
    
    if (promoCode.trim().toUpperCase() === "WELCOME25") {
      setAppliedDiscount(25)
      setPromoSuccess("Promo code WELCOME25 applied: 25% OFF.")
    } else if (promoCode.trim() === "") {
      setPromoError("Please enter a promo code.")
    } else {
      setPromoError("Invalid promo code. Try WELCOME25.")
    }
  }

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return

    if (!isAuthenticated) {
      showToast("Please login to continue shopping", "warning")
      onClose()
      onOpenLogin() // trigger login modal
      return
    }

    onClose()
    navigate("/checkout")
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-brand-blue text-xl" />
              <h2 className="text-lg font-bold text-slate-800">Your Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-grow overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-3xl mb-4">
                  <FiShoppingBag />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">Your cart is empty</h3>
                <p className="text-slate-400 text-sm max-w-xs mb-6 font-medium">Looks like you haven't added any products to your cleaning cart yet.</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue-hover transition-colors shadow-sm text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                    {/* Image wrapper */}
                    <div className="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                      <img
                        src={getProductImage(item.image)}
                        alt={item.name}
                        className="max-h-16 max-w-full object-contain hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 leading-snug">{item.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Qty Selector */}
                        <div className="flex items-center border border-slate-200 rounded-full py-0.5 px-2 bg-slate-50">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                          >
                            <FiMinus className="text-xs" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-700 min-w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                          >
                            <FiPlus className="text-xs" />
                          </button>
                        </div>
                        {/* Price / Delete */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Calculations */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-grow">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon Code (WELCOME25)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800 placeholder-slate-400 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-xs text-rose-500 font-medium pl-1">{promoError}</p>}
              {promoSuccess && <p className="text-xs text-brand-green font-medium pl-1">{promoSuccess}</p>}

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-sm text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-brand-green font-bold">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-brand-green uppercase">FREE</strong> : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-slate-400 text-right">Add ₹{(50 - subtotal).toFixed(2)} more for FREE shipping</p>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-800">
                  <span>Total</span>
                  <span className="text-brand-blue">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-hover"
              >
                <span>Proceed to Checkout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
