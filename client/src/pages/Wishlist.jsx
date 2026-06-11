import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getProductImage, getImageUrl } from "../utils/imageMapper"
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi"
import { CATALOG_MODE } from "../config"

export default function Wishlist() {
  const { wishlist, toggleWishlist, moveToCart } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Title Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FiHeart className="text-rose-500 fill-rose-500 text-2xl" />
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Wishlist</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all shadow-sm"
          >
            Back to Shop
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <FiHeart />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
              Save your favorite WellClean hygiene products to purchase them later.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-full text-xs font-bold hover:bg-brand-blue-hover transition-all"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlist.map((product) => {
              const productId = product._id || product.id
              const imgUrl = product.images?.[0] ? getImageUrl(product.images[0]) : (product.image || getProductImage(product.imageKey))
              
              return (
                <div
                  key={productId}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative p-6 bg-slate-50/50 flex items-center justify-center h-48 border-b border-slate-50">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="max-h-36 max-w-full object-contain"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-rose-500 rounded-full shadow-sm hover:shadow transition-all"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-base font-black text-slate-800">
                        ₹{product.price.toFixed(2)}
                      </span>
                      {CATALOG_MODE ? (
                        <button
                          onClick={() => navigate(`/products/${productId}`)}
                          className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span>View Details</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => moveToCart(product)}
                          className="px-4 py-2 bg-slate-800 hover:bg-brand-blue text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <FiShoppingCart className="text-xs" />
                          <span>Move to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
