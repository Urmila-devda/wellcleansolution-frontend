import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiSearch, FiStar, FiShoppingBag, FiEye, FiHeart, FiSliders, FiChevronLeft, FiChevronRight, FiGrid } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import { CATALOG_MODE } from "../config"
import { productsAPI } from "../services/api"
import { getProductImage, getImageUrl } from "../utils/imageMapper"

export default function Products({
  onAddToCart,
  onQuickView,
  selectedCategory,
  setSelectedCategory
}) {
  const { wishlist, toggleWishlist, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // API State
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState("All")
  const [sortBy, setSortBy] = useState("default")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4 // Set to 4 to demonstrate pagination with our 6 products

  // SEO setup
  useEffect(() => {
    document.title = "Products | WellClean Solutions"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Browse our wide selection of professional-grade cleaning products. From hand washes to floor concentrates, keep your home safe and sparkling clean."
      )
    }
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // We fetch all products, and apply categories, search, sorting, and pagination locally
        const { data } = await productsAPI.getAll()
        const formatted = data.map((prod) => ({
          ...prod,
          id: prod._id,
          image: prod.images?.[0] ? getImageUrl(prod.images[0]) : getProductImage(prod.imageKey),
        }))
        setProducts(formatted)
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm, priceRange, sortBy])

  // Filter products
  const filteredProducts = products.filter((p) => {
    // 1. Category filter
    if (selectedCategory && selectedCategory !== "All" && p.category !== selectedCategory) {
      return false
    }
    // 2. Search filter
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    // 3. Price Filter
    if (priceRange !== "All") {
      if (priceRange === "under-9" && p.price >= 9) return false
      if (priceRange === "9-11" && (p.price < 9 || p.price > 11)) return false
      if (priceRange === "above-11" && p.price <= 11) return false
    }
    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price
    }
    if (sortBy === "price-desc") {
      return b.price - a.price
    }
    if (sortBy === "newest") {
      // Newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    }
    // default (by rating or order)
    return b.rating - a.rating
  })

  // Pagination helper
  const totalItems = sortedProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isInWishlist = (prod) => wishlist.some((item) => (item._id || item.id) === (prod._id || prod.id))

  const categoriesList = ["All", "Hand Wash", "Toilet Cleaner", "Glass Cleaner", "Floor Cleaner", "Dish Wash Liquid", "Surface Cleaner"]

  // Render skeleton loaders for a premium feel
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
          <div className="bg-slate-100 rounded-xl h-48 w-full" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
          <div className="h-5 bg-slate-100 rounded w-3/4" />
          <div className="h-10 bg-slate-100 rounded w-full" />
        </div>
      ))
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-600">Products</span>
          {selectedCategory !== "All" && (
            <>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-brand-blue">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Page Banner Title */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Our Products
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl">
            Explore our curated selection of high-quality solutions for a safer, healthier, and spotless lifestyle.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filter Column (Desktop) */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            
            {/* Categories Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FiGrid className="text-brand-blue" />
                Categories
              </h3>
              <div className="space-y-1.5">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      (selectedCategory || "All") === cat
                        ? "bg-brand-soft-blue text-brand-blue font-extrabold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FiSliders className="text-brand-green" />
                Filter by Price
              </h3>
              <div className="space-y-2">
                {[
                  { label: "All Prices", value: "All" },
                  { label: "Under ₹9", value: "under-9" },
                  { label: "₹9 - ₹11", value: "9-11" },
                  { label: "Above ₹11", value: "above-11" },
                ].map((range) => (
                  <label key={range.value} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-800">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.value}
                      checked={priceRange === range.value}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Product Grid Column */}
          <div className="flex-grow space-y-6">
            
            {/* Top Bar (Search, Sort and Results Count) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search input */}
              <div className="relative w-full sm:max-w-xs">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800 font-semibold"
                />
              </div>

              {/* Sorting and Results summary */}
              <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
                <span className="text-[11px] font-bold text-slate-400">
                  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} items
                </span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-600 font-bold cursor-pointer"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

            </div>

            {CATALOG_MODE && (
              <div className="bg-amber-50 border border-amber-200 text-amber-805 rounded-xl p-3.5 text-xs font-bold text-center w-full shadow-sm flex items-center justify-center gap-2 mb-6">
                <span>📢</span>
                <span>Online ordering will be available shortly.</span>
              </div>
            )}

            {/* Loading / Empty / Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {renderSkeletons()}
              </div>
            ) : currentItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm space-y-3">
                <div className="text-3xl">🔍</div>
                <h3 className="font-extrabold text-slate-800 text-lg">No Products Found</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  We couldn't find any products matching your current filters. Try resetting search query or changing filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                    setPriceRange("All")
                    setSortBy("default")
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-brand-blue text-white rounded-full text-xs font-bold transition-all shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                  {currentItems.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      {/* Product Image Panel */}
                      <div className="relative bg-slate-50/50 p-6 flex items-center justify-center h-48 border-b border-slate-50 overflow-hidden">
                        {product.tag && (
                          <span className="absolute top-3 left-3 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-bold uppercase rounded-full">
                            {product.tag}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWishlist(product)
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow transition-all z-10 flex items-center justify-center"
                          title="Toggle Wishlist"
                        >
                          <FiHeart className={`text-xs ${isInWishlist(product) ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} />
                        </button>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-40 max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Actions overlay on hover */}
                        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onQuickView(product)
                            }}
                            className="p-2.5 bg-white hover:bg-brand-blue text-slate-700 hover:text-white rounded-full shadow-lg transition-colors duration-300"
                            title="Quick View Details"
                          >
                            <FiEye className="text-sm" />
                          </button>
                          {!CATALOG_MODE && isAuthenticated && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onAddToCart(product, 1)
                              }}
                              className="p-2.5 bg-white hover:bg-brand-green text-slate-700 hover:text-white rounded-full shadow-lg transition-colors duration-300"
                              title="Add to Cart"
                            >
                              <FiShoppingBag className="text-sm" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                        <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`text-[10px] ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                          <span className="text-[9px] text-slate-400 font-bold ml-1">({product.rating})</span>
                        </div>

                        {/* Pricing & Add to Cart */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
                          <span className="text-base font-black text-slate-800">₹{product.price.toFixed(2)}</span>
                          {CATALOG_MODE ? (
                            <a
                              href={`https://wa.me/917021204733?text=${encodeURIComponent(
                                `Hi, I'm interested in the product: ${product.name} (Price: ₹${product.price.toFixed(2)}). Could you please provide more details?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-[10px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <span>WhatsApp Enquiry</span>
                            </a>
                          ) : isAuthenticated ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onAddToCart(product, 1)
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-brand-blue text-white rounded-full text-[10px] font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                            >
                              <FiShoppingBag className="text-[10px]" />
                              <span>Add to Cart</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate("/login")
                              }}
                              className="px-3 py-1.5 bg-brand-soft-blue hover:bg-brand-blue text-brand-blue hover:text-white rounded-full text-[10px] font-bold transition-all"
                            >
                              Login to Buy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:hover:border-slate-200 text-slate-500 transition-all shadow-sm"
                      title="Previous Page"
                    >
                      <FiChevronLeft />
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                          currentPage === idx + 1
                            ? "bg-brand-blue text-white border-brand-blue"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:hover:border-slate-200 text-slate-500 transition-all shadow-sm"
                      title="Next Page"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
