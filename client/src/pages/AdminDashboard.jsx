import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ordersAPI, productsAPI, enquiriesAPI } from "../services/api"
import { getProductImage, getImageUrl } from "../utils/imageMapper"
import { useAuth } from "../context/AuthContext"
import {
  FiBriefcase,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiTrendingUp,
  FiLogOut,
  FiClock,
  FiMail,
  FiSearch,
} from "react-icons/fi"

export default function AdminDashboard({ activeTab = "overview" }) {
  const { showToast, logout, socket } = useAuth()
  const navigate = useNavigate()

  // Statistics & Lists state
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalRevenue: 0, pendingOrders: 0 })
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [enquiriesSearch, setEnquiriesSearch] = useState("")
  const [enquiriesFilterStatus, setEnquiriesFilterStatus] = useState("All")

  const getChartData = () => {
    const dailyData = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      dailyData[dateString] = { orders: 0, sales: 0 }
    }

    orders.forEach(order => {
      const dateString = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      if (dailyData[dateString] !== undefined && order.orderStatus !== "Cancelled") {
        dailyData[dateString].orders += 1
        dailyData[dateString].sales += order.totalAmount
      }
    })

    return Object.entries(dailyData).map(([date, val]) => ({
      date,
      orders: val.orders,
      sales: Number(val.sales.toFixed(2))
    }))
  }

  const chartData = getChartData()
  const maxSales = Math.max(...chartData.map(d => d.sales), 1)
  
  const [isLoading, setIsLoading] = useState(true)

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" | "edit"
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Product Form states
  const [prodName, setProdName] = useState("")
  const [prodPrice, setProdPrice] = useState("")
  const [prodCategory, setProdCategory] = useState("Hand Wash")
  const [prodDescription, setProdDescription] = useState("")
  const [prodDetails, setProdDetails] = useState("")
  const [prodImages, setProdImages] = useState([])
  const [newImagesPreview, setNewImagesPreview] = useState([])
  const [prodTag, setProdTag] = useState("")
  const [prodStock, setProdStock] = useState(50)

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    const currentTotalCount = prodImages.length + newImagesPreview.length
    if (currentTotalCount + files.length > 5) {
      showToast("A maximum of 5 images is allowed per product", "warning")
      return
    }

    const updatedPreviews = [...newImagesPreview]
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        showToast(`File "${file.name}" is not a valid image. Only JPG, PNG, and WEBP are allowed.`, "error")
        continue
      }
      
      if (file.size > maxFileSize) {
        showToast(`File "${file.name}" exceeds the 5MB size limit.`, "error")
        continue
      }

      const previewUrl = URL.createObjectURL(file)
      updatedPreviews.push({ file, previewUrl })
    }

    setNewImagesPreview(updatedPreviews)
  }

  const handleRemoveExistingImage = (indexToRemove) => {
    setProdImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleRemoveNewImage = (indexToRemove) => {
    URL.revokeObjectURL(newImagesPreview[indexToRemove].previewUrl)
    setNewImagesPreview(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  useEffect(() => {
    if (!isProductModalOpen) {
      newImagesPreview.forEach(item => URL.revokeObjectURL(item.previewUrl))
      setNewImagesPreview([])
    }
  }, [isProductModalOpen])

  // Fetch admin dashboard details
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch Orders and aggregates
      const ordersRes = await ordersAPI.getAllAdmin()
      setOrders(ordersRes.data.orders)
      setStats(ordersRes.data.stats)

      // 2. Fetch Products
      const productsRes = await productsAPI.getAll({ category: "" })
      setProducts(productsRes.data)

      // 3. Fetch Enquiries
      const enquiriesRes = await enquiriesAPI.getAll()
      setEnquiries(enquiriesRes.data)
    } catch (error) {
      console.error(error)
      showToast("Failed to retrieve admin details", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await ordersAPI.updateStatus(orderId, newStatus)
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: data.orderStatus } : o)))
      showToast(`Order status updated to ${newStatus}`, "success")
      
      if (socket) {
        socket.emit("update_order_status", {
          orderId: data._id,
          userId: data.userId,
          status: data.orderStatus
        })
      }
    } catch (error) {
      console.error(error)
      showToast("Error updating order status", "error")
    }
  }

  const handleEnquiryStatusChange = async (enquiryId, newStatus) => {
    try {
      const { data } = await enquiriesAPI.updateStatus(enquiryId, newStatus)
      setEnquiries((prev) => prev.map((e) => (e._id === enquiryId ? { ...e, status: data.status } : e)))
      showToast(`Enquiry status updated to ${newStatus}`, "success")
    } catch (error) {
      console.error(error)
      showToast("Error updating enquiry status", "error")
    }
  }

  // Delete product CRUD
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    try {
      await productsAPI.delete(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      showToast("Product deleted successfully", "info")
      fetchDashboardData() // Refresh metrics
    } catch (error) {
      console.error(error)
      showToast("Failed to delete product", "error")
    }
  }

  // Open product modal helper
  const openProductModal = (mode, prod = null) => {
    setModalMode(mode)
    setSelectedProduct(prod)
    if (mode === "edit" && prod) {
      setProdName(prod.name)
      setProdPrice(prod.price)
      setProdCategory(prod.category)
      setProdDescription(prod.description)
      setProdDetails(prod.details)
      setProdImages(prod.images || [])
      setNewImagesPreview([])
      setProdTag(prod.tag || "")
      setProdStock(prod.stock)
    } else {
      setProdName("")
      setProdPrice("")
      setProdCategory("Hand Wash")
      setProdDescription("")
      setProdDetails("")
      setProdImages([])
      setNewImagesPreview([])
      setProdTag("")
      setProdStock(50)
    }
    setIsProductModalOpen(true)
  }

  // Add/Edit product submit handler
  const handleProductSubmit = async (e) => {
    e.preventDefault()

    const price = Number(prodPrice)
    const stock = Number(prodStock)

    if (isNaN(price) || price < 0) {
      showToast("Price must be a valid positive number", "warning")
      return
    }

    if (isNaN(stock) || stock < 0) {
      showToast("Stock must be a valid positive integer", "warning")
      return
    }

    const totalImagesCount = prodImages.length + newImagesPreview.length
    if (totalImagesCount < 1) {
      showToast("At least 1 product image is required", "warning")
      return
    }

    setIsLoading(true)

    try {
      let uploadedUrls = []

      // 1. Upload new images if present
      if (newImagesPreview.length > 0) {
        const formData = new FormData()
        newImagesPreview.forEach((item) => {
          formData.append("images", item.file)
        })

        const uploadRes = await productsAPI.uploadImages(formData)
        uploadedUrls = uploadRes.data.urls
      }

      // Combine existing URLs with the newly uploaded ones
      const finalImages = [...prodImages, ...uploadedUrls]

      const payload = {
        name: prodName,
        category: prodCategory,
        description: prodDescription,
        details: prodDetails,
        price,
        images: finalImages,
        tag: prodTag || undefined,
        stock,
        specs: selectedProduct?.specs || [
          { name: "Bottle Volume", value: "500 ml" },
          { name: "Eco Rating", value: "Bio-certified" },
        ],
        ingredients: selectedProduct?.ingredients || "Water-based natural active enzymes.",
      }

      if (modalMode === "add") {
        await productsAPI.create(payload)
        showToast("Product created successfully", "success")
      } else {
        await productsAPI.update(selectedProduct._id, payload)
        showToast("Product updated successfully", "success")
      }
      setIsProductModalOpen(false)
      fetchDashboardData()
    } catch (error) {
      console.error(error)
      showToast(error.response?.data?.message || "Failed to save product", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Confirmed":
        return "bg-cyan-50 text-cyan-700 border-cyan-200"
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-900 text-slate-400 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-2">
            <FiBriefcase className="text-brand-blue text-xl" />
            <span className="text-base font-black text-white tracking-wider">WellClean Admin</span>
          </div>
          <nav className="p-4 space-y-1">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview" ? "bg-brand-blue text-white" : "hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiTrendingUp className="text-base" />
              <span>Overview Metrics</span>
            </button>
            <button
              onClick={() => navigate("/admin/products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "products" ? "bg-brand-blue text-white" : "hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiShoppingBag className="text-base" />
              <span>Manage Products</span>
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "orders" ? "bg-brand-blue text-white" : "hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiShoppingBag className="text-base" />
              <span>Manage Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => navigate("/admin/enquiries")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "enquiries" ? "bg-brand-blue text-white" : "hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiMail className="text-base" />
              <span>Customer Enquiries ({enquiries.length})</span>
            </button>
            
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-all pt-6"
            >
              <FiLogOut className="text-base" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-slate-800/60 text-[10px] text-slate-600 font-semibold uppercase tracking-widest text-center">
          v1.0 WellClean App
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 overflow-y-auto">
        {isLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-brand-blue mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-bold text-slate-400">Loading admin metrics...</span>
          </div>
        ) : (
          <div>
            
            {/* OVERVIEW METRICS TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Overview</h1>
                  <p className="text-xs text-slate-400 mt-1">Real-time revenue, order quantities, and user listings</p>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sales Revenue</p>
                      <h3 className="text-2xl font-black text-slate-800">${stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-soft-blue text-brand-blue flex items-center justify-center text-xl">
                      <FiDollarSign />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Orders Logged</p>
                      <h3 className="text-2xl font-black text-slate-800">{stats.totalOrders}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-soft-green text-brand-green flex items-center justify-center text-xl">
                      <FiShoppingBag />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Orders</p>
                      <h3 className="text-2xl font-black text-slate-800">{stats.pendingOrders}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                      <FiClock className="text-base" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Accounts</p>
                      <h3 className="text-2xl font-black text-slate-800">{stats.totalUsers}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl">
                      <FiUsers />
                    </div>
                  </div>

                </div>

                {/* Sales & Orders Analytics Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Sales & Orders Trend (Last 7 Days)</h3>
                    <p className="text-[10px] text-slate-400">Hover over bars to view daily revenue and order counts</p>
                  </div>
                  
                  {/* SVG Bar Chart container */}
                  <div className="h-64 w-full flex items-end justify-between pt-6 border-b border-slate-100 px-4 relative">
                    {chartData.map((d, index) => {
                      const barHeight = (d.sales / maxSales) * 160
                      return (
                        <div key={index} className="flex flex-col items-center flex-1 group relative">
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[9px] font-bold py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none text-center shadow-lg min-w-[80px]">
                            <div className="border-b border-slate-700 pb-0.5 mb-0.5">{d.date}</div>
                            <div className="text-brand-soft-blue">{d.orders} Orders</div>
                            <div className="text-brand-soft-green">₹{d.sales.toFixed(2)}</div>
                          </div>
                          
                          {/* SVG Bar */}
                          <div 
                            style={{ height: `${Math.max(barHeight, 8)}px` }}
                            className="w-10 bg-slate-100 group-hover:bg-brand-blue rounded-t-md transition-all duration-300 relative flex justify-center items-start pt-1.5 cursor-pointer border border-transparent group-hover:border-brand-blue-hover"
                          >
                            {d.orders > 0 && (
                              <span className="text-[9px] font-black text-slate-400 group-hover:text-white leading-none">
                                {d.orders}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-[9px] text-slate-400 font-bold mt-2.5">
                            {d.date}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-50 pb-3">Latest Orders Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold text-slate-600">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Total Cost</th>
                          <th className="pb-3">Dispatch Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40">
                            <td className="py-3.5 font-mono text-[10px] text-slate-400">{order._id}</td>
                            <td className="py-3.5 text-slate-800">{order.userId?.name || "Deleted User"}</td>
                            <td className="py-3.5 font-bold text-slate-700">₹{order.totalAmount.toFixed(2)}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusClass(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* PRODUCT MANAGEMENT TAB */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Catalog</h1>
                    <p className="text-xs text-slate-400 mt-1">Add, update, or remove WellClean products</p>
                  </div>
                  <button
                    onClick={() => openProductModal("add")}
                    className="px-4 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-hover transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FiPlus className="text-base" />
                    <span>Create Product</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="p-4 pl-6">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30">
                          <td className="p-4 pl-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                               <img
                                 src={getImageUrl(prod.images?.[0] || prod.imageKey)}
                                 alt={prod.name}
                                 className="max-h-8 max-w-full object-contain"
                               />
                            </div>
                            <div>
                              <h4 className="text-slate-800 font-bold leading-tight">{prod.name}</h4>
                              {prod.tag && <span className="text-[9px] text-brand-blue font-black uppercase mt-0.5 bg-brand-soft-blue px-1.5 py-0.5 rounded-full inline-block">{prod.tag}</span>}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-slate-500">{prod.category}</td>
                          <td className="p-4 font-black text-slate-800">₹{prod.price.toFixed(2)}</td>
                          <td className={`p-4 font-bold ${prod.stock <= 5 ? "text-rose-500 animate-pulse" : "text-slate-700"}`}>
                            {prod.stock} items
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button
                              onClick={() => openProductModal("edit", prod)}
                              className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-slate-100 rounded transition-colors"
                              title="Edit product details"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete product"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS MANAGEMENT TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manage Orders</h1>
                  <p className="text-xs text-slate-400 mt-1">Review orders and update delivery dispatch states</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Products Purchased</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4">Shipping Address</th>
                        <th className="p-4 pr-6">Change Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30">
                          <td className="p-4 pl-6 font-mono text-[10px] text-slate-400 max-w-[90px] truncate" title={order._id}>
                            {order._id}
                          </td>
                           <td className="p-4">
                            <h4 className="text-slate-800 font-bold">{order.userId?.name || "Deleted User"}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{order.userId?.email}</p>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-[10px] text-slate-500 leading-tight">
                                  📦 {item.name} &times; <strong>{item.quantity}</strong>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-black text-slate-800">₹{order.totalAmount.toFixed(2)}</td>
                          <td className="p-4 max-w-[200px] text-[10px] leading-relaxed text-slate-500">
                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br/>
                            📞 {order.shippingAddress.phone}
                          </td>
                          <td className="p-4 pr-6">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer ${getStatusClass(
                                order.orderStatus
                              )}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CUSTOMER ENQUIRIES TAB */}
            {activeTab === "enquiries" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Customer Enquiries</h1>
                    <p className="text-xs text-slate-400 mt-1">Review and manage client contact and business support inquiries</p>
                  </div>
                </div>

                {/* Search & Filter Panel */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:max-w-xs">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search enquiries..."
                      value={enquiriesSearch}
                      onChange={(e) => setEnquiriesSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                    <span className="text-[11px] font-bold text-slate-400">
                      Total Enquiries: {enquiries.length}
                    </span>

                    <select
                      value={enquiriesFilterStatus}
                      onChange={(e) => setEnquiriesFilterStatus(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-600 font-bold cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Enquiries Grid/List */}
                {enquiries.filter((enq) => {
                  if (enquiriesFilterStatus !== "All" && enq.status !== enquiriesFilterStatus) {
                    return false
                  }
                  if (enquiriesSearch) {
                    const searchLower = enquiriesSearch.toLowerCase()
                    const matchesName = enq.fullName.toLowerCase().includes(searchLower)
                    const matchesEmail = enq.email.toLowerCase().includes(searchLower)
                    const matchesSubject = enq.subject.toLowerCase().includes(searchLower)
                    const matchesMessage = enq.message.toLowerCase().includes(searchLower)
                    return matchesName || matchesEmail || matchesSubject || matchesMessage
                  }
                  return true
                }).length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm space-y-3">
                    <div className="text-3xl">✉️</div>
                    <h3 className="font-extrabold text-slate-800 text-lg">No Enquiries Found</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      There are no customer enquiries matching your criteria at this moment.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs font-semibold text-slate-600">
                      <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="p-4 pl-6">Submitted</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Subject & Message</th>
                          <th className="p-4 pr-6">Status & Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries
                          .filter((enq) => {
                            if (enquiriesFilterStatus !== "All" && enq.status !== enquiriesFilterStatus) return false
                            if (enquiriesSearch) {
                              const s = enquiriesSearch.toLowerCase()
                              return (
                                enq.fullName.toLowerCase().includes(s) ||
                                enq.email.toLowerCase().includes(s) ||
                                enq.subject.toLowerCase().includes(s) ||
                                enq.message.toLowerCase().includes(s)
                              )
                            }
                            return true
                          })
                          .map((enq) => {
                            let badgeClass = ""
                            if (enq.status === "New") badgeClass = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse-subtle"
                            else if (enq.status === "In Progress") badgeClass = "bg-blue-50 text-blue-700 border-blue-200"
                            else if (enq.status === "Resolved") badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200"

                            return (
                              <tr key={enq._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30">
                                <td className="p-4 pl-6 text-slate-400 text-[10px] whitespace-nowrap">
                                  {new Date(enq.createdAt).toLocaleDateString()}<br />
                                  {new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4 font-sans">
                                  <h4 className="text-slate-800 font-bold">{enq.fullName}</h4>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{enq.email}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">📞 {enq.phone}</p>
                                </td>
                                <td className="p-4 max-w-sm font-sans">
                                  <h5 className="font-bold text-slate-800 mb-1">{enq.subject}</h5>
                                  <p className="text-slate-500 font-normal leading-relaxed text-[11px] whitespace-pre-wrap">{enq.message}</p>
                                </td>
                                <td className="p-4 pr-6">
                                  <select
                                    value={enq.status}
                                    onChange={(e) => handleEnquiryStatusChange(enq._id, e.target.value)}
                                    className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer ${badgeClass}`}
                                  >
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                  </select>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-fade-in-up p-6 z-10 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {modalMode === "add" ? "Create New Product" : "Edit Product Details"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure catalogs details, prices, and stock inventory</p>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WellClean Toilet Gel"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-bold"
                  >
                    <option value="Hand Wash">Hand Wash</option>
                    <option value="Toilet Cleaner">Toilet Cleaner</option>
                    <option value="Glass Cleaner">Glass Cleaner</option>
                    <option value="Floor Cleaner">Floor Cleaner</option>
                    <option value="Dish Wash Liquid">Dish Wash Liquid</option>
                    <option value="Surface Cleaner">Surface Cleaner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Price (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 10.49"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Stock Available</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block">Product Images (1 to 5 images, Max 5MB each)</label>
                  <div className="grid grid-cols-5 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[90px] items-center">
                    {/* Existing Images */}
                    {prodImages.map((imgUrl, index) => (
                      <div key={`existing-${index}`} className="relative group aspect-square border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
                        <img src={getImageUrl(imgUrl)} alt="Product" className="w-full h-full object-cover" />
                        {index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-brand-blue text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wide">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Image"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {/* New Preview Images */}
                    {newImagesPreview.map((item, index) => (
                      <div key={`new-${index}`} className="relative group aspect-square border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
                        <img src={item.previewUrl} alt="New Preview" className="w-full h-full object-cover" />
                        {prodImages.length + index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-brand-blue text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wide">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Image"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload button */}
                    {prodImages.length + newImagesPreview.length < 5 && (
                      <label className="aspect-square border border-dashed border-slate-300 rounded-md flex flex-col justify-center items-center cursor-pointer hover:bg-slate-100 hover:border-brand-blue transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-[9px] text-slate-400 mt-1 font-semibold">Add Image</span>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Product Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={prodTag}
                    onChange={(e) => setProdTag(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize product use (e.g. Gentle on hands, tough on germs...)"
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Detailed Description & Ingredients</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed specs and ingredients list..."
                  value={prodDetails}
                  onChange={(e) => setProdDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-blue text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  {modalMode === "add" ? "Create Product" : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
