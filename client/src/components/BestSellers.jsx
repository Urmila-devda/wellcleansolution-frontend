import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingBag, FiHeart, FiSearch, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { CATALOG_MODE } from '../config';

export default function BestSellers({ 
  products, 
  onAddToCart, 
  selectedCategory, 
  onSelectCategory,
  isFeaturedOnly = false
}) {
  const { wishlist, toggleWishlist, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('All')
  const [minRating, setMinRating] = useState('All')
  const [brand, setBrand] = useState('All')

  // Apply filters on the products list
  const filteredProducts = products.filter(p => {
    // 1. Category tab filter
    if (selectedCategory && selectedCategory !== 'All' && p.category !== selectedCategory) return false
    // 2. Text Search
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    // 3. Price Filter
    if (priceRange !== 'All') {
      if (priceRange === 'under-9' && p.price >= 9) return false
      if (priceRange === '9-11' && (p.price < 9 || p.price > 11)) return false
      if (priceRange === 'above-11' && p.price <= 11) return false
    }
    // 4. Rating Filter
    if (minRating !== 'All') {
      if (p.rating < Number(minRating)) return false
    }
    // 5. Brand Filter
    if (brand !== 'All') {
      if (brand === 'wellclean' && !p.name.includes('Well Clean')) return false
    }
    return true
  })

  // Select which products list to render
  const displayProducts = isFeaturedOnly 
    ? products.slice(0, 6) // homepage displays 4-6 bestseller products
    : filteredProducts

  const isInWishlist = (prod) => wishlist.some((item) => (item._id || item.id) === (prod._id || prod.id))

  const categories = ['All', 'Hand Wash', 'Toilet Cleaner', 'Glass Cleaner', 'Floor Cleaner', 'Dish Wash Liquid', 'Surface Cleaner'];

  return (
    <section id="products" className="py-20 bg-slate-50/50 font-sans scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold text-brand-green uppercase tracking-widest bg-brand-soft-green px-3 py-1 rounded-full">
            {isFeaturedOnly ? 'Bestsellers' : 'Our Catalog'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {isFeaturedOnly ? 'Featured Cleaning Solutions' : 'Loved by Thousands of Households'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Discover our top-rated cleaning products trusted by families for ultimate germ protection and sparkling clean results.
          </p>
        </div>

        {CATALOG_MODE && (
          <div className="bg-amber-50 border border-amber-200 text-amber-805 rounded-xl p-3.5 text-xs font-bold text-center max-w-xl mx-auto mb-8 shadow-sm flex items-center justify-center gap-2">
            <span>📢</span>
            <span>Online ordering will be available shortly.</span>
          </div>
        )}

        {/* Category Tabs (Hidden in Featured-only mode) */}
        {!isFeaturedOnly && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm border ${
                  selectedCategory === cat
                    ? 'bg-brand-blue text-white border-brand-blue shadow-brand-blue/10'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Search and Filters panel (Hidden in Featured-only mode) */}
        {!isFeaturedOnly && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-12 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-800"
                />
              </div>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-600 font-bold cursor-pointer"
              >
                <option value="All">All Prices</option>
                <option value="under-9">Under $9</option>
                <option value="9-11">$9 - $11</option>
                <option value="above-11">Above $11</option>
              </select>

              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-600 font-bold cursor-pointer"
              >
                <option value="All">All Ratings</option>
                <option value="4.8">4.8 Stars & Up</option>
                <option value="4.9">4.9 Stars & Up</option>
              </select>

              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue text-slate-600 font-bold cursor-pointer"
              >
                <option value="All">All Brands</option>
                <option value="wellclean">WellClean Solutions</option>
              </select>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {displayProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
            >
              {/* Product Image Panel */}
              <div className="relative bg-slate-50/50 p-2 flex items-center justify-center h-28 sm:h-36 border-b border-slate-100/60 overflow-hidden">
                {product.tag && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-brand-blue/10 text-brand-blue text-[8px] font-bold uppercase rounded-full">
                    {product.tag}
                  </span>
                )}
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product)
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white hover:bg-slate-50 rounded-full shadow border border-slate-100/80 transition-all z-10 flex items-center justify-center cursor-pointer"
                  title="Toggle Wishlist"
                >
                  <FiHeart className={`text-xs ${isInWishlist(product) ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                </button>
                
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-24 sm:max-h-28 max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Product Info */}
              <div className="p-2.5 sm:p-3 flex flex-col flex-grow justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest truncate">{product.category}</span>
                      {product.size && (
                        <span className="text-[8px] font-extrabold text-slate-500 bg-slate-100 px-1 rounded flex-shrink-0">
                          {product.size}
                        </span>
                      )}
                    </div>
                    {/* Rating Pill */}
                    <div className="flex items-center gap-0.5 bg-amber-50 px-1 py-0.5 rounded text-[9px] text-amber-700 font-bold border border-amber-100 flex-shrink-0">
                      <FiStar className="text-[9px] text-amber-500 fill-amber-500" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <p className="text-slate-400 text-[10px] line-clamp-1 leading-normal">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100/60">
                  {/* Price */}
                  <div className="text-xs sm:text-sm font-black text-slate-800">
                    ₹{product.price.toFixed(2)}
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col gap-1.5">
                    {/* Catalog Mode WhatsApp Enquiry OR Add to Cart / Login to Buy */}
                    {CATALOG_MODE ? (
                      <a
                        href={`https://wa.me/917021204733?text=${encodeURIComponent(
                          `Hi, I'm interested in the product: ${product.name} (Price: ₹${product.price.toFixed(2)}). Could you please provide more details?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer text-center border border-transparent"
                      >
                        <span>WhatsApp Enquiry</span>
                      </a>
                    ) : isAuthenticated ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddToCart(product, 1)
                        }}
                        className="w-full py-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
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
                        className="w-full py-1.5 bg-brand-soft-blue hover:bg-brand-blue hover:text-white text-brand-blue rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer"
                      >
                        Login to Buy
                      </button>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/products/${product.id}`)
                      }}
                      className="w-full py-1.5 border border-slate-200 hover:border-brand-blue hover:text-brand-blue text-slate-600 rounded-lg text-[10px] sm:text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products button (Shown only in Featured-only mode) */}
        {isFeaturedOnly && (
          <div className="flex justify-center pt-12">
            <button
              onClick={() => navigate("/products")}
              className="px-8 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-full text-xs font-extrabold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>View All Products</span>
              <FiArrowRight className="text-sm" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
