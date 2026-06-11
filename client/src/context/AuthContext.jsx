import React, { createContext, useState, useEffect, useContext } from "react"
import { authAPI, cartAPI, setAuthToken } from "../services/api"
import { io } from "socket.io-client"
import { CATALOG_MODE } from "../config"


const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(sessionStorage.getItem("token") || null)
  const [socket, setSocket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [toasts, setToasts] = useState([])
  const [wishlist, setWishlist] = useState(() => {
    const cached = sessionStorage.getItem("wishlist")
    return cached ? JSON.parse(cached) : []
  })

  // Manage socket.io connection based on user state
  useEffect(() => {
    let newSocket
    if (user && user._id) {
      newSocket = io("http://localhost:5000")
      setSocket(newSocket)

      newSocket.on("connect", () => {
        newSocket.emit("join_room", user._id)
        console.log(`Socket joined room for user: ${user._id}`)
      })
    } else {
      setSocket(null)
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    sessionStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  // Manage toasts queue
  const showToast = (message, type = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Load user profile and cart on startup if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        setAuthToken(token)
        try {
          // Verify token by loading profile
          const { data } = await authAPI.getProfile()
          setUser(data)

          // Load user's cart from database
          const cartRes = await cartAPI.get()
          // Map populate schema structure to flat structure expected by UI components
          const items = cartRes.data.items.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            category: item.product.category,
            description: item.product.description,
            image: item.product.images?.[0] || item.product.imageKey, // frontend will map this key
            quantity: item.quantity,
            product: item.product, // keep reference
          }))
          setCartItems(items)
        } catch (error) {
          console.error("Token verification failed:", error)
          handleLogout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Sync cart to backend database whenever cartItems state changes (except when loading)
  const syncCartWithDB = async (itemsList) => {
    if (token) {
      try {
        const payload = itemsList.map((item) => ({
          product: item.id || item.product._id,
          quantity: item.quantity,
        }))
        await cartAPI.sync(payload)
      } catch (error) {
        console.error("Failed to sync cart to database:", error)
      }
    }
  }

  // Auth Operations
  const handleLogin = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password })
      setAuthToken(data.token)
      sessionStorage.setItem("token", data.token)
      setToken(data.token)
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      })
      showToast(`Welcome back, ${data.name}!`, "success")

      // Load cart right after login
      const cartRes = await cartAPI.get()
      const items = cartRes.data.items.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        category: item.product.category,
        description: item.product.description,
        image: item.product.images?.[0] || item.product.imageKey,
        quantity: item.quantity,
        product: item.product,
      }))
      setCartItems(items)
      return { success: true, user: data }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid credentials. Please try again."
      showToast(msg, "error")
      return { success: false, error: msg }
    }
  }

  const handleRegister = async (userData) => {
    try {
      const { data } = await authAPI.register(userData)
      setAuthToken(data.token)
      sessionStorage.setItem("token", data.token)
      setToken(data.token)
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
      })
      showToast("Account registered successfully! Welcome.", "success")
      setCartItems([])
      return { success: true, user: data }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please check your inputs."
      showToast(msg, "error")
      return { success: false, error: msg }
    }
  }

  function handleLogout() {
    setAuthToken(null)
    sessionStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setCartItems([])
    showToast("Logged out successfully.", "info")
  }

  // Cart Operations (only allow if logged in, otherwise show toast/modal)
  const handleAddToCart = (product, quantity = 1) => {
    if (CATALOG_MODE) {
      showToast("Online ordering will be available shortly.", "warning")
      return false
    }
    if (!token) {
      showToast("Please login to continue shopping", "warning")
      return false // Indicates failure to caller (so it can open LoginModal)
    }

    let updatedCart
    setCartItems((prevItems) => {
      // Product can come from API or seed database structure
      const productId = product._id || product.id
      const existing = prevItems.find((item) => item.id === productId)
      
      if (existing) {
        updatedCart = prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      } else {
        updatedCart = [
          ...prevItems,
          {
            id: productId,
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.images?.[0] || product.imageKey || product.image,
            quantity: quantity,
            product: product,
          },
        ]
      }
      syncCartWithDB(updatedCart)
      return updatedCart
    })

    showToast(`Added ${product.name} to cart`, "success")
    return true
  }

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id)
      return
    }
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      syncCartWithDB(updated)
      return updated
    })
  }

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== id)
      syncCartWithDB(updated)
      showToast("Item removed from cart", "info")
      return updated
    })
  }

  const handleClearCart = async () => {
    setCartItems([])
    if (token) {
      try {
        await cartAPI.clear()
      } catch (error) {
        console.error("Failed to clear cart in DB:", error)
      }
    }
  }

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const productId = product._id || product.id
      const exists = prev.some((item) => (item._id || item.id) === productId)
      if (exists) {
        showToast("Removed from wishlist", "info")
        return prev.filter((item) => (item._id || item.id) !== productId)
      } else {
        showToast("Added to wishlist", "success")
        return [...prev, product]
      }
    })
  }

  const moveToCart = (product) => {
    if (CATALOG_MODE) {
      showToast("Online ordering will be available shortly.", "warning")
      return
    }
    const success = handleAddToCart(product, 1)
    if (success) {
      const productId = product._id || product.id
      setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        cartItems,
        toasts,
        showToast,
        wishlist,
        toggleWishlist,
        moveToCart,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        addToCart: handleAddToCart,
        updateQty: handleUpdateQty,
        removeItem: handleRemoveItem,
        clearCart: handleClearCart,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
