import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { paymentAPI } from "../services/api"
import { getProductImage } from "../utils/imageMapper"
import { FiShoppingBag, FiMapPin, FiPhone, FiCheckCircle, FiUser, FiMail } from "react-icons/fi"

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const { user, cartItems, clearCart, showToast } = useAuth()
  const navigate = useNavigate()
  
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [country, setCountry] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Subtotal calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Hardcoded check for WELCOME25 coupon in local context
  const [couponCode, setCouponCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0) // percentage
  const [promoMessage, setPromoMessage] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
    }
  }, [user])

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (couponCode.trim().toUpperCase() === "WELCOME25") {
      setAppliedDiscount(25)
      setPromoMessage("Coupon WELCOME25 applied: 25% OFF!")
    } else {
      setPromoMessage("Invalid coupon code.")
      setAppliedDiscount(0)
    }
  }

  const discountAmount = subtotal * (appliedDiscount / 100)
  const afterDiscount = subtotal - discountAmount
  const shipping = afterDiscount > 99 || subtotal === 0 ? 0 : 5.99
  const total = afterDiscount + shipping

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "warning")
      return
    }

    setIsSubmitting(true)

    // Load Razorpay Script SDK
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded) {
      showToast("Failed to load Razorpay payment SDK. Are you online?", "error")
      setIsSubmitting(false)
      return
    }

    try {
      // Create Razorpay Order
      const { data: orderData } = await paymentAPI.createOrder(total)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Well Clean Solutions",
        description: "Purchase of Hygiene/Cleaning Detergents",
        order_id: orderData.id,
        handler: async (response) => {
          setIsSubmitting(true)
          try {
            const verifyPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              items: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
              shippingAddress: {
                street,
                city,
                state,
                zip,
                country,
                phone,
              },
              couponCode: appliedDiscount > 0 ? "WELCOME25" : "",
            }

            const { data: verifiedOrder } = await paymentAPI.verifyPayment(verifyPayload)
            
            clearCart()
            showToast("Payment Successful and Order Placed!", "success")
            
            navigate("/payment-success", {
              state: {
                orderNumber: verifiedOrder.orderNumber,
                paymentId: verifiedOrder.razorpayPaymentId,
                amount: verifiedOrder.totalAmount,
                status: verifiedOrder.orderStatus,
              },
            })
          } catch (verificationError) {
            console.error("Signature verification error:", verificationError)
            const errorMsg = verificationError.response?.data?.message || "Payment verification failed"
            showToast(errorMsg, "error")
            navigate("/payment-failed", {
              state: { reason: errorMsg },
            })
          } finally {
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#007BFF",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
            showToast("Payment cancelled by user", "warning")
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", function (resp) {
        setIsSubmitting(false)
        showToast(resp.error.description || "Payment Failed", "error")
        navigate("/payment-failed", {
          state: { reason: resp.error.description || "Payment rejected by gateway" },
        })
      })
      
      rzp.open()
    } catch (error) {
      console.error("Payment initialization failed:", error)
      showToast(error.response?.data?.message || "Payment service error. Try again.", "error")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FiShoppingBag className="text-brand-blue text-2xl" />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Secure Checkout</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Your cart is empty</h3>
            <p className="text-sm text-slate-400 mb-6">You need to add cleaning products before checking out.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-full text-xs font-bold hover:bg-brand-blue-hover transition-all"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              
              {/* Shipping Information Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FiMapPin className="text-brand-blue text-lg" />
                  <h2 className="text-base font-bold text-slate-800">Checkout Information</h2>
                </div>
                
                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Customer Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                      />
                    </div>
                  </div>
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Eco Way, Apt 4B"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Greenfield"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">State / Province</label>
                    <input
                      type="text"
                      required
                      placeholder="California"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Zip / Pincode</label>
                    <input
                      type="text"
                      required
                      placeholder="400607"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Country</label>
                    <input
                      type="text"
                      required
                      placeholder="India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Mobile Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Promo code panel */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Have a Promo Coupon?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME25"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue/50 text-slate-800 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[10px] font-bold mt-1.5 ${appliedDiscount > 0 ? "text-brand-green" : "text-rose-500"}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer ${
                  isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-brand-blue hover:bg-brand-blue-hover hover:shadow-lg"
                }`}
              >
                {isSubmitting ? "Securing Your Payment..." : `Proceed to Payment (₹${total.toFixed(2)})`}
              </button>

            </form>

            {/* Order Summary Column */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Order Summary</h2>

              {/* Cart items list */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 flex-shrink-0">
                      <img
                        src={getProductImage(item.image)}
                        alt={item.name}
                        className="max-h-10 max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-slate-700 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Qty: {item.quantity} &times; ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-brand-green font-bold">
                    <span>Coupon (25% Off)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Eco-Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-brand-green uppercase">FREE</strong> : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-sm font-black text-slate-800">
                  <span>Grand Total</span>
                  <span className="text-brand-blue text-base">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Eco Note */}
              <div className="bg-brand-soft-green/50 p-4 rounded-xl border border-brand-green/10 text-[10px] text-brand-green-hover leading-relaxed">
                🍀 <strong>Green Shipping Guarantee:</strong> We pack all cleaning detergents in biodegradable boxes using paper tape and soy-based inks. Zero single-use plastics!
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
