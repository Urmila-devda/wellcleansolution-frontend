import { useState, useEffect } from "react"
import { Outlet, useLocation, Navigate, useOutletContext, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import CartDrawer from "../components/CartDrawer"
import SearchModal from "../components/SearchModal"
import LoginModal from "../components/LoginModal"
import QuickViewModal from "../components/QuickViewModal"
import ToastContainer from "../components/Toast"
import { useAuth } from "../context/AuthContext"
import { productsAPI } from "../services/api"
import { getProductImage, getImageUrl } from "../utils/imageMapper"
import { CATALOG_MODE } from "../config"


// Static products dataset (for search modal fallback)
import handwashImg from "../assets/handwash.png"
import toiletImg from "../assets/toilet_cleaner.png"
import glassImg from "../assets/glass_cleaner.png"
import floorImg from "../assets/floor_cleaner.png"
import dishwashImg from "../assets/dishwash.png"
import surfaceImg from "../assets/multi_surface.png"

const staticProducts = [
  { id: 1, name: "Well Clean Solutions Hand Wash", category: "Hand Wash", price: 8.99, image: handwashImg, imageKey: "handwash" },
  { id: 2, name: "Well Clean Solutions Toilet Cleaner", category: "Toilet Cleaner", price: 10.49, image: toiletImg, imageKey: "toilet" },
  { id: 3, name: "Well Clean Solutions Glass Cleaner", category: "Glass Cleaner", price: 7.99, image: glassImg, imageKey: "glass" },
  { id: 4, name: "Well Clean Solutions Floor Cleaner", category: "Floor Cleaner", price: 12.99, image: floorImg, imageKey: "floor" },
  { id: 5, name: "Well Clean Solutions Dish Wash Liquid", category: "Dish Wash Liquid", price: 6.99, image: dishwashImg, imageKey: "dishwash" },
  { id: 6, name: "Well Clean Solutions Multi-Surface Cleaner", category: "Surface Cleaner", price: 9.49, image: surfaceImg, imageKey: "surface" },
]

export default function UserLayout() {
  const { user, isAuthenticated, addToCart } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [products, setProducts] = useState([])

  // Fetch products for SearchModal dynamically
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getAll()
        const formatted = data.map((prod) => ({
          ...prod,
          id: prod._id,
          image: prod.images?.[0] ? getImageUrl(prod.images[0]) : getProductImage(prod.imageKey),
        }))
        setProducts(formatted)
      } catch (error) {
        console.error("Failed to load products in UserLayout:", error)
        // Fallback to static products if API fails
        const formattedStatic = staticProducts.map((prod) => ({
          ...prod,
          image: prod.image,
        }))
        setProducts(formattedStatic)
      }
    }
    fetchProducts()
  }, [])

  // Modals visibility states
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    if (location.pathname !== "/products") {
      navigate("/products")
    }
  }

  // Scroll to top on page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Listen to path changes to trigger modals
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      setIsLoginOpen(true)
    } else if (location.pathname === "/cart") {
      if (CATALOG_MODE) {
        navigate("/", { replace: true })
      } else {
        setIsCartOpen(true)
      }
    }
  }, [location.pathname])

  // Redirect admin users to admin dashboard if they try to access user routes
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />
  }

  // Add to cart with login verification
  const handleAddToCart = (product, quantity = 1) => {
    const success = addToCart(product, quantity)
    if (success) {
      setIsCartOpen(true)
    } else {
      // Guest attempted add to cart → show login modal
      setIsLoginOpen(true)
    }
  }

  // Quick view triggers
  const handleQuickView = (product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  // Apply Coupon from Promo Banner
  const handleApplyPromoBanner = () => {
    setIsCartOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Header
        onOpenCart={() => navigate("/cart")}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => navigate("/login")}
        onSelectCategory={handleSelectCategory}
      />

      {/* Routed Main Panels */}
      <main className="flex-grow">
        <Outlet context={{ handleAddToCart, handleQuickView, handleApplyPromoBanner, selectedCategory, setSelectedCategory }} />
      </main>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Side Panels / Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false)
          if (location.pathname === "/cart") {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1)
            } else {
              navigate("/")
            }
          }
        }}
        onOpenLogin={() => navigate("/login")}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onQuickView={handleQuickView}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false)
          if (location.pathname === "/login" || location.pathname === "/register") {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1)
            } else {
              navigate("/")
            }
          }
        }}
      />

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Elegant Toast Notifications banner list */}
      <ToastContainer />
    </div>
  )
}

// Wrapper component to forward context functions as page props to keep pages unchanged
export function UserRouteWrapper({ Component }) {
  const { handleAddToCart, handleQuickView, handleApplyPromoBanner, selectedCategory, setSelectedCategory } = useOutletContext()
  return (
    <Component
      onAddToCart={handleAddToCart}
      onQuickView={handleQuickView}
      onApplyPromoBanner={handleApplyPromoBanner}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
    />
  )
}
