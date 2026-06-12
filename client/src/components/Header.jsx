import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiBriefcase, FiFileText, FiHeart, FiChevronUp } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import logoImg from "../assets/logo.jpg"
import { CATALOG_MODE } from "../config"

export default function Header({ onOpenCart, onOpenSearch, onOpenLogin, onSelectCategory }) {
  const { user, logout, cartItems, wishlist } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)
  const wishlistCount = wishlist?.length || 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false)
    navigate("/")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAboutClick = () => {
    setIsMobileMenuOpen(false)
    navigate("/about")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    
    // If not on Home page, navigate to Home first
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        el?.scrollIntoView({ behavior: "smooth" })
      }, 350)
    } else {
      const el = document.getElementById(sectionId)
      el?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleProductsClick = () => {
    setIsMobileMenuOpen(false)
    if (onSelectCategory) {
      onSelectCategory("All")
    }
    navigate("/products")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm py-2.5" 
            : "bg-white/95 border-b border-slate-100 py-3.5"
        }`}
      >
        {CATALOG_MODE && (
          <div className="bg-amber-500 text-white text-center py-1.5 px-4 text-[11px] font-bold w-full tracking-wide shadow-sm flex items-center justify-center gap-1.5 animate-pulse-subtle">
            <span>📢</span>
            <span>Online ordering will be available shortly. Inquiry operations are active.</span>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Text */}
          <button onClick={handleHomeClick} className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-green rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300" />
              <img src={logoImg} alt="Well Clean Solutions" className="relative h-10 w-auto object-contain rounded-lg border border-slate-100 bg-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-800 hidden sm:block">
              Well Clean <span className="text-brand-blue">Solutions</span>
            </span>
          </button>

          {/* Desktop Navigation Links: Pill Navigation Style */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-full border border-slate-200/40">
            <button
              onClick={handleHomeClick}
              className={`text-xs font-bold tracking-wide transition-all px-4 py-2 rounded-full cursor-pointer focus:outline-none ${
                location.pathname === "/" 
                  ? "bg-white text-brand-blue shadow-sm font-extrabold" 
                  : "text-slate-600 hover:text-brand-blue hover:bg-white/50"
              }`}
            >
              Home
            </button>
            <button
              onClick={handleProductsClick}
              className={`text-xs font-bold tracking-wide transition-all px-4 py-2 rounded-full cursor-pointer focus:outline-none ${
                location.pathname === "/products" 
                  ? "bg-white text-brand-blue shadow-sm font-extrabold" 
                  : "text-slate-600 hover:text-brand-blue hover:bg-white/50"
              }`}
            >
              Products
            </button>
            <button
              onClick={handleAboutClick}
              className={`text-xs font-bold tracking-wide transition-all px-4 py-2 rounded-full cursor-pointer focus:outline-none ${
                location.pathname === "/about" 
                  ? "bg-white text-brand-blue shadow-sm font-extrabold" 
                  : "text-slate-600 hover:text-brand-blue hover:bg-white/50"
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("contact-us")}
              className="text-xs font-bold tracking-wide transition-all px-4 py-2 rounded-full cursor-pointer focus:outline-none text-slate-600 hover:text-brand-blue hover:bg-white/50"
            >
              Contact
            </button>
          </nav>

          {/* Action Icons and Search Pill */}
          <div className="flex items-center gap-3">
            
            {/* Integrated Search Bar Trigger */}
            <div 
              onClick={onOpenSearch}
              className="relative hidden lg:block cursor-pointer group"
            >
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-blue transition-colors text-sm" />
              <div className="pl-9 pr-8 py-1.5 bg-slate-50 group-hover:bg-slate-100/80 border border-slate-200/80 group-hover:border-slate-300 rounded-full text-slate-400 text-xs font-bold w-40 transition-all select-none shadow-inner">
                Search products...
              </div>
            </div>

            {/* Mobile/Tablet Search Button */}
            <button
              onClick={onOpenSearch}
              className="lg:hidden p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100/60 rounded-full transition-all cursor-pointer focus:outline-none"
              title="Search Products"
            >
              <FiSearch className="text-lg" />
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-slate-100/60 rounded-full relative transition-all flex items-center"
              title="Wishlist"
            >
              <FiHeart className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white animate-pulse-subtle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            {user && !CATALOG_MODE && (
              <button
                onClick={onOpenCart}
                className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100/60 rounded-full relative transition-all cursor-pointer focus:outline-none"
                title="Shopping Cart"
              >
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-blue text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white animate-pulse-subtle">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Dropdown Profile Button */}
            <div className="relative group">
              {user ? (
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 p-1.5 px-3 bg-brand-soft-blue hover:bg-brand-blue hover:text-white text-brand-blue rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none border border-brand-blue/10 shadow-sm">
                    <FiUser className="text-sm" />
                    <span className="max-w-[70px] truncate hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg border border-slate-100 py-1.5 hidden group-hover:block animate-fade-in z-50">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <FiBriefcase className="text-sm" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    {!CATALOG_MODE && (
                      <>
                        <Link
                          to="/orders"
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <FiFileText className="text-sm" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/track-order"
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <FiSearch className="text-sm" />
                          <span>Track Order</span>
                        </Link>
                      </>
                    )}
                    <hr className="border-slate-100 my-1" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100/60 rounded-full transition-all cursor-pointer focus:outline-none border border-slate-200/60 shadow-sm"
                  title="User Profile / Login"
                >
                  <FiUser className="text-lg" />
                </button>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-100/60 rounded-full md:hidden transition-all cursor-pointer focus:outline-none border border-slate-200/60 shadow-sm"
            >
              {isMobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-4 space-y-3 shadow-inner">
            <button
              onClick={handleHomeClick}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue capitalize transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={handleProductsClick}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue capitalize transition-colors cursor-pointer"
            >
              Products
            </button>
            
            {user && !CATALOG_MODE && (
              <Link
                to="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue capitalize transition-colors"
              >
                Track Order
              </Link>
            )}

            <button
              onClick={handleAboutClick}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue capitalize transition-colors cursor-pointer"
            >
              About
            </button>

            <button
              onClick={() => handleNavClick("contact-us")}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue capitalize transition-colors cursor-pointer"
            >
              Contact
            </button>

            {user && !CATALOG_MODE && (
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue capitalize transition-colors"
              >
                My Orders
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-brand-green hover:text-brand-green-hover capitalize transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </header>
      
      {/* Spacer to push content below header */}
      <div className={CATALOG_MODE ? "h-[104px]" : "h-[76px]"} />

      {/* Floating Back-to-Top scroll action button */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-6 right-6 p-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-full shadow-lg transition-all z-50 flex items-center justify-center cursor-pointer animate-fade-in hover:scale-110 border border-white/20 focus:outline-none"
          title="Back to Top"
        >
          <FiChevronUp className="text-xl" />
        </button>
      )}
    </>
  )
}
