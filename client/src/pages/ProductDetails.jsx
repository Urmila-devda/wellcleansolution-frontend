import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { FiStar, FiShoppingBag, FiCheck, FiShield, FiHeart, FiPlus, FiMinus, FiInfo, FiLayers, FiList, FiAlertTriangle } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import { productsAPI } from "../services/api"
import { getProductImage, getImageUrl, getCategoryFallbackImage } from "../utils/imageMapper"
import { CATALOG_MODE } from "../config"


export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { wishlist, toggleWishlist, isAuthenticated } = useAuth()

  // Details state
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  
  // Image gallery select state
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // Fetch product detail and related products
  useEffect(() => {
    setActiveImageIdx(0)
    const fetchProductData = async () => {
      setIsLoading(true)
      try {
        // Fetch current product
        const { data: currentProd } = await productsAPI.getOne(id)
        const formattedProduct = {
          ...currentProd,
          id: currentProd._id,
          image: currentProd.images?.[0] ? getImageUrl(currentProd.images[0]) : getProductImage(currentProd.imageKey),
        }
        setProduct(formattedProduct)

        // Set SEO tags
        document.title = `${formattedProduct.name} | WellClean Solutions`
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
          metaDesc.setAttribute("content", formattedProduct.description)
        }

        // Fetch related products (filter by same category, excluding current)
        const { data: allProds } = await productsAPI.getAll({ category: currentProd.category })
        const filteredRelated = allProds
          .filter((p) => p._id !== currentProd._id)
          .map((p) => ({
            ...p,
            id: p._id,
            image: p.images?.[0] ? getImageUrl(p.images[0]) : getProductImage(p.imageKey),
          }))
          .slice(0, 3)

        // If not enough related products in category, fetch other products
        if (filteredRelated.length < 3) {
          const { data: fallbackProds } = await productsAPI.getAll()
          const additional = fallbackProds
            .filter((p) => p._id !== currentProd._id && !filteredRelated.some((r) => r.id === p._id))
            .map((p) => ({
              ...p,
              id: p._id,
              image: p.images?.[0] ? getImageUrl(p.images[0]) : getProductImage(p.imageKey),
            }))
            .slice(0, 3 - filteredRelated.length)
          
          setRelatedProducts([...filteredRelated, ...additional])
        } else {
          setRelatedProducts(filteredRelated)
        }
      } catch (error) {
        console.error(error)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product, qty)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      const success = onAddToCart(product, qty)
      if (success) {
        navigate("/checkout")
      }
    }
  }

  const isInWishlist = (prod) => {
    return wishlist.some((item) => item._id === prod?.id || item._id === prod?._id)
  }

  // Get dynamic instructions based on product category
  const getInstructions = (category) => {
    switch (category) {
      case "Hand Wash":
        return {
          usage: "Wet your hands with clean water. Apply a single pump of Well Clean Hand Wash. Rub hands vigorously together for at least 20 seconds, scrub between fingers and under fingernails, then rinse thoroughly and dry.",
          safety: "For external skin use only. Avoid rubbing eyes immediately after contact. In case of accidental eye contact, rinse instantly with clean running water. Keep stored in a dry place."
        }
      case "Toilet Cleaner":
        return {
          usage: "Apply the sanitation gel along the upper toilet bowl rim and scrub surfaces. Allow the concentrated gel to settle for 10-15 minutes to dissolve lime scale and hard stains. Brush surfaces gently and flush.",
          safety: "Keep out of reach of children. Highly concentrated. Avoid direct contact with skin and eyes. We recommend wearing protective household cleaning gloves while using."
        }
      case "Glass Cleaner":
        return {
          usage: "Spray from a distance of 15-20cm directly onto mirrors, tables, glass panels, or steel frames. Wipe clean immediately with a dry microfiber cloth or soft towel to avoid streak marks.",
          safety: "Ammonia-free formula. Do not breathe or ingest spray mist. Avoid contact with eyes. Keep bottles away from flame or extreme temperature."
        }
      case "Floor Cleaner":
        return {
          usage: "Add 15ml (approximately one capful) of Well Clean Floor Cleaner Concentrate into a bucket of water (approx. 5 Litres). Stir well, mop floor surfaces gently, and allow to air dry. No rinsing needed.",
          safety: "For surface floor cleaning only. Do not swallow. In case of accidental ingestion, drink clean water and contact a medical professional immediately. Keep out of reach of children."
        }
      case "Dish Wash Liquid":
        return {
          usage: "Dilute a teaspoon of Dish Wash Liquid in a small bowl of water. Dip cleaning scrub sponge, work into a rich grease-cutting lather, clean cookware and plates, then rinse thoroughly.",
          safety: "Avoid eye contact. In case of contact, rinse eyes immediately with clean water. Wear rubber gloves if skin is highly sensitive to dish wash soaps."
        }
      default:
        return {
          usage: "Spray directly onto the surface area (countertops, appliances, dining tables). Wipe clean with a dry towel or clean sponge. No scrubbing or rinsing needed.",
          safety: "Perform a small test on varnished wood or polished marble before first use. Do not ingest. Keep out of reach of children."
        }
    }
  }

  // Render Skeleton Loader for Product Details
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-soft-blue border-t-brand-blue rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs">Loading product specs...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 max-w-sm px-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <FiInfo className="text-slate-400 text-2xl" />
          </div>
          <h3 className="text-slate-800 font-black text-lg">Product Not Found</h3>
          <p className="text-slate-500 text-xs">The product you are trying to view does not exist or has been removed.</p>
          <Link to="/products" className="inline-block px-5 py-2.5 bg-brand-blue text-white rounded-full text-xs font-bold transition-all shadow">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Gallery images list: map images field, fallback to main image
  const galleryImages = product.images && product.images.length > 0
    ? product.images.map(img => getImageUrl(img))
    : [product.image]

  const handleIncrement = () => setQty((prev) => prev + 1)
  const handleDecrement = () => setQty((prev) => (prev > 1 ? prev - 1 : 1))

  const instructions = getInstructions(product.category)

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb path */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-blue transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold max-w-[200px] truncate">{product.name}</span>
        </nav>

        {/* Main Flipkart/Amazon Grid layout */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 flex flex-col lg:flex-row gap-10 shadow-sm">
          
          {/* Left Column: Image Gallery Stage */}
          <div className="lg:w-5/12 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative bg-slate-50 border border-slate-100/80 rounded-2xl p-8 flex items-center justify-center min-h-[350px] md:min-h-[420px] overflow-hidden">
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-brand-blue text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-sm z-10">
                  {product.tag}
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-2.5 bg-white hover:bg-slate-50 rounded-full shadow border border-slate-100 transition-all z-10 flex items-center justify-center cursor-pointer"
                title="Toggle Wishlist"
              >
                <FiHeart className={`text-base ${isInWishlist(product) ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} />
              </button>

              <img
                src={galleryImages[activeImageIdx]}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = getCategoryFallbackImage(product.category)
                }}
                className="max-h-[300px] md:max-h-[360px] object-contain transition-transform duration-300 ease-out hover:scale-[1.05]"
              />

            </div>

            {/* Thumbnails strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 justify-center">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIdx(index)}
                    className={`w-16 h-16 rounded-xl border-2 p-2 bg-slate-50 flex items-center justify-center transition-all cursor-pointer ${
                      activeImageIdx === index
                        ? "border-brand-blue ring-2 ring-brand-soft-blue"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View angle ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = getCategoryFallbackImage(product.category)
                      }}
                      className="max-h-full max-w-full object-contain"
                    />

                  </button>
                ))}
              </div>
            )}

            {/* Visual Quality Assurance trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-[10px] font-bold text-slate-400 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-sm mb-1">🌿</span>
                <span>Bio-certified Formula</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-sm mb-1">🛡️</span>
                <span>99.9% Protection</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="block text-sm mb-1">♻️</span>
                <span>Recyclable Plastic</span>
              </div>
            </div>

          </div>

          {/* Right Column: Detailed Product Purchase Info */}
          <div className="lg:w-7/12 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
                  WellClean Solutions Brand
                </span>
                {product.size && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
                    Volume: {product.size}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-850 leading-tight">
                {product.name}
              </h1>

              {/* Reviews & Star Rating */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">{product.rating} Rating</span>
                <span className="text-slate-350">|</span>
                <span className="text-xs font-bold text-brand-green flex items-center gap-1">
                  <FiCheck className="text-sm stroke-[3px]" />
                  {product.stock > 0 ? "In stock(Available)" : "Out of Stock"}
                </span>
              </div>

              {/* Price block */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">₹{product.price.toFixed(2)}</span>
                <span className="text-xs text-slate-450 font-bold uppercase tracking-wide">Inc. of all local taxes</span>
              </div>

              {/* Responsive Tab Panel */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
                  {[
                    { id: "description", label: "Description", icon: <FiInfo /> },
                    { id: "specifications", label: "Specifications", icon: <FiList /> },
                    { id: "ingredients", label: "Ingredients", icon: <FiLayers /> },
                    { id: "usage", label: "Usage Guide", icon: <FiCheck /> },
                    { id: "safety", label: "Safety Warnings", icon: <FiAlertTriangle /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-2.5 pr-6 text-xs font-bold flex items-center gap-1.5 capitalize transition-all border-b-2 -mb-[2px] cursor-pointer focus:outline-none ${
                        activeTab === tab.id
                          ? "border-brand-blue text-brand-blue font-extrabold"
                          : "border-transparent text-slate-400 hover:text-slate-655"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab contents description, spec, ingredient, usage & safety */}
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed min-h-[120px] font-semibold py-2">
                  {activeTab === "description" && (
                    <p className="whitespace-pre-line text-slate-500 leading-relaxed font-semibold">
                      {product.details || product.description}
                    </p>
                  )}
                  {activeTab === "specifications" && (
                    <div className="border border-slate-100 rounded-xl overflow-hidden max-w-md bg-white">
                      {product.specs && product.specs.length > 0 ? (
                        product.specs.map((spec, i) => (
                          <div key={i} className="flex justify-between border-b border-slate-50 last:border-0 p-3 text-xs">
                            <span className="text-slate-400 font-bold">{spec.name}</span>
                            <span className="text-slate-750 font-black">{spec.value}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 p-3 italic">No technical specifications listed.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "ingredients" && (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <p className="text-slate-550 font-bold uppercase tracking-wider text-[10px] mb-2 text-slate-400">Formulation Active Agents:</p>
                      <p className="italic text-slate-600 font-bold leading-relaxed">
                        {product.ingredients || "Purified water, organic surfactants, soil penetrants, natural pine essence oils."}
                      </p>
                    </div>
                  )}
                  {activeTab === "usage" && (
                    <div className="p-4 bg-brand-soft-blue/20 rounded-xl border border-brand-blue/10">
                      <p className="text-slate-550 font-bold uppercase tracking-wider text-[10px] mb-2 text-brand-blue">Recommended Usage Instructions:</p>
                      <p className="text-slate-600 font-bold leading-relaxed">{instructions.usage}</p>
                    </div>
                  )}
                  {activeTab === "safety" && (
                    <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-105/50">
                      <p className="text-slate-550 font-bold uppercase tracking-wider text-[10px] mb-2 text-rose-500">Critical Safety Standards:</p>
                      <p className="text-slate-600 font-bold leading-relaxed">{instructions.safety}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Actions Panel and catalog checks */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              
              {CATALOG_MODE ? (
                <div className="space-y-4">
                  {/* Notice Alert Banner */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-xs font-bold flex items-center gap-2.5 shadow-sm">
                    <span>📢</span>
                    <span>Online ordering will be available shortly. For inquiries, Call/WhatsApp: +91 7021204733</span>
                  </div>

                  {/* Actions buttons grid */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {/* WhatsApp Enquiry */}
                    <a
                      href={`https://wa.me/917021204733?text=${encodeURIComponent(
                        `Hi, I'm interested in the product: ${product.name} (Price: ₹${product.price.toFixed(2)}). Could you please provide more details?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs text-center border border-transparent cursor-pointer"
                    >
                      <span>WhatsApp Enquiry</span>
                    </a>

                    {/* Request Quote form redirect */}
                    <button
                      onClick={() => {
                        navigate("/", {
                          state: {
                            scrollToContact: true,
                            prefillSubject: `Quote request for ${product.name}`,
                            prefillMessage: `Hi, I would like to request a business price quote for ${product.name} (Price: ₹${product.price.toFixed(2)}). Please contact me with more information.`
                          }
                        })
                      }}
                      className="flex-1 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold transition-all shadow-md text-xs cursor-pointer focus:outline-none"
                    >
                      Request Quote
                    </button>

                    {/* Contact Us */}
                    <button
                      onClick={() => {
                        navigate("/", {
                          state: {
                            scrollToContact: true,
                            prefillSubject: `Inquiry about ${product.name}`,
                            prefillMessage: `Hi, I have a question regarding the availability and volume pricing for ${product.name}. Please contact me.`
                          }
                        })
                      }}
                      className="flex-1 py-3.5 border border-slate-200 hover:border-brand-blue hover:text-brand-blue text-slate-600 rounded-xl font-bold transition-all text-xs cursor-pointer focus:outline-none"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  
                  {/* Qty selectors */}
                  <div className="flex items-center border border-slate-200 rounded-full py-2 px-4 bg-slate-50 shadow-inner">
                    <button
                      onClick={handleDecrement}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors focus:outline-none"
                      title="Decrease Quantity"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="px-5 text-sm font-extrabold text-slate-800 min-w-8 text-center">{qty}</span>
                    <button
                      onClick={handleIncrement}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors focus:outline-none"
                      title="Increase Quantity"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-grow py-3.5 bg-slate-800 text-white rounded-full font-bold hover:bg-brand-blue transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <FiShoppingBag className="text-sm" />
                    <span>Add to Cart - ₹{(product.price * qty).toFixed(2)}</span>
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto px-8 py-3.5 bg-brand-green hover:bg-brand-green-hover text-white rounded-full font-bold transition-all shadow-md text-xs whitespace-nowrap cursor-pointer"
                  >
                    Buy Now
                  </button>

                </div>
              ) : (
                <div className="bg-brand-soft-blue border border-brand-blue/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="text-xs font-semibold text-slate-500 text-center sm:text-left">
                    🔒 Log in to access secure payments checkout and buy this product.
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-full transition-all shadow cursor-pointer focus:outline-none"
                  >
                    Login / Register
                  </button>
                </div>
              )}

              {/* Protective badges info details */}
              <div className="flex flex-wrap gap-4 items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-50">
                <span className="flex items-center gap-1.5">
                  <FiShield className="text-brand-green text-sm" />
                  <span>99.9% Bacteria Germ Defense</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FiHeart className="text-rose-500 fill-rose-500 text-sm" />
                  <span>100% High-Performance Concentrate</span>
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products list */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Related Cleaning Solutions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/products/${p.id}`)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div className="bg-slate-50/50 p-6 flex items-center justify-center h-44 border-b border-slate-50 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = getCategoryFallbackImage(p.category)
                      }}
                      className="max-h-36 max-w-full object-contain group-hover:scale-[1.05] transition-transform duration-500"
                    />

                  </div>
                  <div className="p-4 space-y-2 flex flex-col justify-between flex-grow">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                      <h3 className="font-bold text-slate-850 text-sm leading-snug group-hover:text-brand-blue transition-colors truncate">
                        {p.name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <span className="text-sm font-black text-slate-800">₹{p.price.toFixed(2)}</span>
                      <button className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer focus:outline-none">View Product →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
