import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { returnsAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { FiUpload, FiTrash2, FiFileText, FiArrowLeft, FiCheckCircle } from "react-icons/fi"

export default function ReturnRequest() {
  const { user, showToast } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderNumberParam = searchParams.get("orderNumber") || ""

  // Form states
  const [orderNumber, setOrderNumber] = useState(orderNumberParam)
  const [customerName, setCustomerName] = useState(user?.name || "")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState(user?.email || "")
  const [reason, setReason] = useState("Damaged Product")
  const [description, setDescription] = useState("")
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedRequest, setSubmittedRequest] = useState(null)

  // Populate user data once loaded
  useEffect(() => {
    if (user) {
      setCustomerName(prev => prev || user.name || "")
      setEmail(prev => prev || user.email || "")
    }
  }, [user])

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    if (imageFiles.length + files.length > 5) {
      showToast("A maximum of 5 images can be uploaded", "warning")
      return
    }

    const updatedFiles = [...imageFiles]
    const updatedPreviews = [...imagePreviews]

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        showToast(`File "${file.name}" is not a valid image. Only JPG, PNG, and WEBP are allowed.`, "error")
        continue
      }
      if (file.size > maxFileSize) {
        showToast(`File "${file.name}" exceeds the 5MB size limit.`, "error")
        continue
      }

      updatedFiles.push(file)
      updatedPreviews.push(URL.createObjectURL(file))
    }

    setImageFiles(updatedFiles)
    setImagePreviews(updatedPreviews)
  }

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles(prev => prev.filter((_, idx) => idx !== index))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== index))
  }

  // Clean up URL object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      showToast("Order Number is required", "warning")
      return
    }
    if (!customerName.trim()) {
      showToast("Name is required", "warning")
      return
    }
    if (!phoneNumber.trim()) {
      showToast("Contact number is required", "warning")
      return
    }
    if (!email.trim()) {
      showToast("Email address is required", "warning")
      return
    }
    if (!description.trim()) {
      showToast("Please describe the issue in detail", "warning")
      return
    }
    if (imageFiles.length < 1) {
      showToast("At least 1 product image is mandatory", "warning")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("orderNumber", orderNumber.trim())
      formData.append("customerName", customerName.trim())
      formData.append("phoneNumber", phoneNumber.trim())
      formData.append("email", email.trim())
      formData.append("reason", reason)
      formData.append("description", description.trim())
      
      imageFiles.forEach(file => {
        formData.append("images", file)
      })

      const { data } = await returnsAPI.submit(formData)
      setSubmittedRequest(data)
      setIsSuccess(true)
      showToast("Return request submitted successfully!", "success")
    } catch (error) {
      console.error("Return request submission error:", error)
      showToast(error.response?.data?.message || "Failed to submit return request. Please check your order details.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess && submittedRequest) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-brand-soft-green text-brand-green rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">
            <FiCheckCircle />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Return Request Received</h1>
            <p className="text-sm text-slate-500">
              Your claim has been logged under Request ID: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 text-xs font-semibold">{submittedRequest._id}</span>
            </p>
          </div>

          <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 text-left space-y-4 text-xs font-semibold text-slate-650">
            <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px] border-b pb-2">Request Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">Order Reference:</span>
                <p className="text-slate-800 font-bold">{submittedRequest.orderNumber}</p>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <p className="text-amber-600 font-bold">🟡 {submittedRequest.status}</p>
              </div>
              <div>
                <span className="text-slate-400">Submitted Name:</span>
                <p className="text-slate-800 font-bold">{submittedRequest.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">Contact Number:</span>
                <p className="text-slate-800 font-bold">{submittedRequest.phoneNumber}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Reason for Return:</span>
                <p className="text-slate-800 font-bold">{submittedRequest.reason}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Description of Issue:</span>
                <p className="text-slate-700 font-normal mt-0.5 leading-relaxed bg-white p-3 border border-slate-100 rounded-lg whitespace-pre-wrap">{submittedRequest.description}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Our admin team will review your photos and claim details. Once verified, you will receive an update. Thank you for your patience!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate("/my-orders")}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-hover transition-all shadow-md shadow-brand-blue/20 cursor-pointer"
            >
              Go to Order History
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-soft-blue text-brand-blue flex items-center justify-center text-lg">
              <FiFileText />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Return / Refund Request</h1>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Submit a return or refund request for delivered products. Please note that return requests are only accepted within <span className="font-bold text-slate-700">24 hours of delivery</span> and require clear photo evidence.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Order Number */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Order Number / ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter order reference or ID"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-800 font-semibold"
                  required
                />
              </div>

              {/* Reason for Return */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Reason for Return <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-700 font-bold cursor-pointer"
                >
                  <option value="Damaged Product">Damaged Product</option>
                  <option value="Defective Product">Defective Product</option>
                  <option value="Wrong Product Delivered">Wrong Product Delivered</option>
                  <option value="Leaked Product">Leaked Product</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-800 font-semibold"
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-800 font-semibold"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-800 font-semibold"
                  required
                />
              </div>

              {/* Issue Description */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Describe the Issue <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Please provide details about the issue with the product (e.g. package was punctured, item does not spray, wrong item quantity, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-slate-700 font-normal leading-relaxed"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-3 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Upload Product Images <span className="text-rose-500">*</span>
                  <span className="text-slate-400 normal-case font-normal ml-2">(1 to 5 images, Max 5MB per image, JPG/PNG/WEBP only)</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {/* Previews */}
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="aspect-square bg-slate-50 border border-slate-150 rounded-xl overflow-hidden relative group">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 shadow-sm cursor-pointer"
                        title="Remove image"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Trigger */}
                  {imageFiles.length < 5 && (
                    <label className="aspect-square bg-slate-50 hover:bg-slate-100/60 border-2 border-dashed border-slate-200 hover:border-brand-blue rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <FiUpload className="text-slate-400 text-base" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Upload File</span>
                    </label>
                  )}
                </div>
              </div>

            </div>

            {/* Form actions */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-hover transition-all shadow-md shadow-brand-blue/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting Claim...</span>
                  </>
                ) : (
                  <span>Submit Return Request</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
