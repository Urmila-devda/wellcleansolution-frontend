import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { FiStar, FiShoppingBag, FiCheck, FiShield, FiHeart, FiPlus, FiMinus, FiInfo, FiLayers, FiList } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import { productsAPI } from "../services/api"
import { getProductImage, getImageUrl } from "../utils/imageMapper"
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

        {/* Main Grid: Gallery & Info */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 flex flex-col md:flex-row gap-10 shadow-sm">
          
          {/* Left Column: Image Gallery Stage */}
          <div className="md:w-1/2 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-8 flex items-center justify-center min-h-[350px] md:min-h-[420px] overflow-hidden">
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-brand-blue text-white text-xs font-extrabold uppercase rounded-full tracking-wider shadow-sm z-10 animate-pulse-subtle">
                  {product.tag}
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-2.5 bg-white hover:bg-slate-50 rounded-full shadow border border-slate-100 transition-all z-10 flex items-center justify-center"
                title="Toggle Wishlist"
              >
                <FiHeart className={`text-base ${isInWishlist(product) ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} />
              </button>

              <img
                src={galleryImages[activeImageIdx]}
                alt={product.name}
                className="max-h-[300px] md:max-h-[360px] object-contain transition-transform duration-300 ease-out hover:scale-150 cursor-zoom-in"
              />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 justify-center">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIdx(index)}
                    className={`w-16 h-16 rounded-xl border-2 p-2 bg-slate-50 flex items-center justify-center transition-all ${
                      activeImageIdx === index
                        ? "border-brand-blue ring-2 ring-brand-soft-blue"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt={`View angle ${index + 1}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Product Info Area */}
          <div className="md:w-1/2 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-brand-blue uppercase tracking-widest bg-brand-soft-blue px-3 py-1 rounded-full">
                  WellCleanSolutions
                </span>
                {product.size && (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {product.size}
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-3 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">{product.rating} Rating</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-brand-green flex items-center gap-1">
                  <FiCheck className="text-sm stroke-[3px]" />
                  {product.stock > 0 ? "In stock(Available)" : "Out of Stock"}
                </span>
              </div>

              {/* Price Display */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">₹{product.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-bold">Inc. local taxes & duties</span>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-slate-100 mb-4">
                {[
                  { id: "description", label: "Description", icon: <FiInfo /> },
                  { id: "specifications", label: "Specifications", icon: <FiList /> },
                  { id: "ingredients", label: "Ingredients", icon: <FiLayers /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 pr-6 text-xs font-bold flex items-center gap-1.5 capitalize transition-all border-b-2 -mb-[2px] ${
                      activeTab === tab.id
                        ? "border-brand-blue text-brand-blue font-extrabold"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed min-h-[100px]">
                {activeTab === "description" && (
                  <p className="whitespace-pre-line text-slate-500 font-medium">
                    {product.details || product.description}
                  </p>
                )}
                {activeTab === "specifications" && (
                  <div className="border border-slate-100 rounded-xl overflow-hidden max-w-sm">
                    {product.specs && product.specs.length > 0 ? (
                      product.specs.map((spec, i) => (
                        <div key={i} className="flex justify-between border-b border-slate-50 last:border-0 p-2 text-xs">
                          <span className="text-slate-400 font-semibold">{spec.name}</span>
                          <span className="text-slate-700 font-extrabold">{spec.value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 p-3 italic">No specific tech specs listed.</p>
                    )}
                  </div>
                )}
                {activeTab === "ingredients" && (
                  <p className="italic text-slate-500 font-medium p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-100">
                    {product.ingredients || "Naturally derived biodegradable surfactant system, natural essential fragrance oils, purified water base."}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              
              {CATALOG_MODE ? (
                <div className="space-y-4">
                  {/* Notice Banner */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2 shadow-sm">
                    <span>📢</span>
                    <span>Online ordering will be available shortly.</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {/* WhatsApp Enquiry Button */}
                    <a
                      href={`https://wa.me/917021204733?text=${encodeURIComponent(
                        `Hi, I'm interested in the product: ${product.name} (Price: ₹${product.price.toFixed(2)}). Could you please provide more details?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs text-center border border-transparent"
                    >
                      <span>WhatsApp Enquiry</span>
                    </a>

                    {/* Request Quote Button */}
                    <button
                      onClick={() => {
                        navigate("/", {
                          state: {
                            scrollToContact: true,
                            prefillSubject: `Quote request for ${product.name}`,
                            prefillMessage: `Hi, I would like to request a price quote for ${product.name} (Price: ₹${product.price.toFixed(2)}). Please contact me with more information.`
                          }
                        })
                      }}
                      className="flex-1 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl font-bold transition-all shadow-md text-xs cursor-pointer"
                    >
                      Request Quote
                    </button>

                    {/* Contact Us Button */}
                    <button
                      onClick={() => {
                        navigate("/", {
                          state: {
                            scrollToContact: true,
                            prefillSubject: `Inquiry about ${product.name}`,
                            prefillMessage: `Hi, I have a question regarding ${product.name}. Please contact me.`
                          }
                        })
                      }}
                      className="flex-1 py-3 border border-slate-200 hover:border-brand-blue hover:text-brand-blue text-slate-600 rounded-xl font-bold transition-all text-xs cursor-pointer"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-full py-2 px-4 bg-slate-50 shadow-inner">
                    <button
                      onClick={handleDecrement}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                      title="Decrease Quantity"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="px-5 text-sm font-extrabold text-slate-800 min-w-8 text-center">{qty}</span>
                    <button
                      onClick={handleIncrement}
                      className="p-1 text-slate-500 hover:text-brand-blue transition-colors"
                      title="Increase Quantity"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-grow py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-brand-blue transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <FiShoppingBag className="text-sm" />
                    <span>Add to Cart - ₹{(product.price * qty).toFixed(2)}</span>
                  </button>

                  {/* Buy Now CTA */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-white rounded-full font-bold transition-all shadow-md text-xs whitespace-nowrap"
                  >
                    Buy Now
                  </button>

                </div>
              ) : (
                <div className="bg-brand-soft-blue border border-brand-blue/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-slate-600 text-center sm:text-left">
                    🔒 Log in to access checkout and shop this product.
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-full transition-all shadow"
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
                  <span>100% Eco-Friendly Concentrate</span>
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products list */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Related Cleaning Solutions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  <div className="bg-slate-50/50 p-6 flex items-center justify-center h-44 border-b border-slate-50 overflow-hidden relative">
                    <img src={p.image} alt={p.name} className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                    <h3 className="font-bold text-slate-850 text-sm leading-snug group-hover:text-brand-blue transition-colors truncate">
                      {p.name}
                    </h3>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-black text-slate-800">₹{p.price.toFixed(2)}</span>
                      <button className="text-[10px] font-bold text-brand-blue hover:underline">View Product →</button>
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
