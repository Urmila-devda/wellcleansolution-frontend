import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiBriefcase, FiFileText, FiHeart } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import logoImg from "../assets/logo.jpg"
import { CATALOG_MODE } from "../config"

export default function Header({ onOpenCart, onOpenSearch, onOpenLogin, onSelectCategory }) {
  const { user, logout, cartItems, wishlist } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)
  const wishlistCount = wishlist?.length || 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    
    // If not on Home page, navigate to Home first
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        el?.scrollIntoView({ behavior: "smooth" })
      }, 300)
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
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-45 transition-all duration-300 font-sans ${
          isScrolled ? "glassmorphism shadow-md py-3" : "bg-white/90 border-b border-slate-100 py-4"
        }`}
      >
        {CATALOG_MODE && (
          <div className="bg-amber-500 text-white text-center py-1.5 px-4 text-[11px] font-bold w-full tracking-wide shadow-sm flex items-center justify-center gap-1.5 animate-pulse-subtle">
            <span>📢</span>
            <span>Online ordering will be available shortly.</span>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <img src={logoImg} alt="Well Clean Solutions" className="h-10 w-auto object-contain rounded" />
            <span className="text-xl font-extrabold tracking-tight text-slate-800">
              Well Clean <span className="text-brand-blue">Solutions</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick("hero")}
              className="text-sm font-semibold text-slate-600 hover:text-brand-blue capitalize tracking-wide transition-colors relative group py-1 cursor-pointer"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
            </button>
            <button
              onClick={handleProductsClick}
              className="text-sm font-semibold text-slate-600 hover:text-brand-blue capitalize tracking-wide transition-colors relative group py-1 cursor-pointer"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
            </button>
            
            {/* Conditional Track Order Link: Visible only if logged in */}
            {user && !CATALOG_MODE && (
              <Link
                to="/track-order"
                className="text-sm font-semibold text-slate-600 hover:text-brand-blue capitalize tracking-wide transition-colors relative group py-1 flex items-center gap-1"
              >
                <FiSearch />
                <span>Track Order</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
              </Link>
            )}

            <button
              onClick={() => handleNavClick("about-us")}
              className="text-sm font-semibold text-slate-600 hover:text-brand-blue capitalize tracking-wide transition-colors relative group py-1 cursor-pointer"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
            </button>
            
            <button
              onClick={() => handleNavClick("contact-us")}
              className="text-sm font-semibold text-slate-600 hover:text-brand-blue capitalize tracking-wide transition-colors relative group py-1 cursor-pointer"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
            </button>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm font-bold text-brand-green hover:text-brand-green-hover capitalize tracking-wide transition-colors relative group py-1 flex items-center gap-1"
              >
                <FiBriefcase />
                <span>Admin Panel</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* Search, User Account, Cart Actions */}
          <div className="flex items-center gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-full transition-all cursor-pointer"
              title="Search Products"
            >
              <FiSearch className="text-lg" />
            </button>

            {/* User Account / Dropdown */}
            <div className="relative group">
              {user ? (
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 p-1.5 px-3 bg-brand-soft-blue text-brand-blue rounded-full text-xs font-bold hover:bg-brand-blue hover:text-white transition-colors cursor-pointer">
                    <FiUser className="text-sm" />
                    <span className="max-w-[80px] truncate">Hi, {user.name.split(" ")[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 hidden group-hover:block animate-fade-in z-50">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <FiBriefcase className="text-sm" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    {!CATALOG_MODE && (
                      <>
                        <Link
                          to="/orders"
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <FiFileText className="text-sm" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/track-order"
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <FiSearch className="text-sm" />
                          <span>Track Order</span>
                        </Link>
                      </>
                    )}
                    <hr className="border-slate-100 my-1" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-full transition-all cursor-pointer"
                  title="User Profile / Login"
                >
                  <FiUser className="text-lg" />
                </button>
              )}
            </div>

            {/* Wishlist Trigger */}
            <Link
              to="/wishlist"
              className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-slate-50 rounded-full relative transition-all flex items-center"
              title="Wishlist"
            >
              <FiHeart className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white animate-pulse-subtle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger: Visible only if logged in */}
            {user && !CATALOG_MODE && (
              <button
                onClick={onOpenCart}
                className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-full relative transition-all cursor-pointer"
                title="Shopping Cart"
              >
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white animate-pulse-subtle">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-600 hover:text-brand-blue hover:bg-slate-50 rounded-full md:hidden transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-6 py-4 space-y-3 shadow-inner">
            <button
              onClick={() => handleNavClick("hero")}
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
            
            {/* Conditional Mobile Track Order Link: Visible only if logged in */}
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
              onClick={() => handleNavClick("about-us")}
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
      {/* Spacer to push elements down */}
      <div className={CATALOG_MODE ? "h-[104px]" : "h-[72px]"} />
    </>
  )
}
