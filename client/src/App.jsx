import { Routes, Route, Navigate } from "react-router-dom"
import { CATALOG_MODE } from "./config"

// Layouts
import UserLayout, { UserRouteWrapper } from "./layouts/UserLayout"
import AdminLayout from "./layouts/AdminLayout"

// Pages
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Checkout from "./pages/Checkout"
import OrderHistory from "./pages/OrderHistory"
import AdminDashboard from "./pages/AdminDashboard"
import Wishlist from "./pages/Wishlist"
import TrackOrder from "./pages/TrackOrder"

// Routing wrapper
import ProtectedRoute from "./components/ProtectedRoute"

// Global Context Provider
import { AuthProvider } from "./context/AuthContext"

function AppContent() {
  return (
    <Routes>
      {/* User Routes inside UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserRouteWrapper Component={Home} />} />
        <Route path="/products" element={<UserRouteWrapper Component={Products} />} />
        <Route path="/products/:id" element={<UserRouteWrapper Component={ProductDetails} />} />
        <Route
          path="/cart"
          element={
            CATALOG_MODE ? (
              <Navigate to="/" replace />
            ) : (
              <UserRouteWrapper Component={Home} />
            )
          }
        />
        <Route path="/login" element={<UserRouteWrapper Component={Home} />} />
        <Route path="/register" element={<UserRouteWrapper Component={Home} />} />
        <Route path="/wishlist" element={<UserRouteWrapper Component={Wishlist} />} />
        
        <Route
          path="/checkout"
          element={
            CATALOG_MODE ? (
              <Navigate to="/" replace />
            ) : (
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/orders"
          element={
            CATALOG_MODE ? (
              <Navigate to="/" replace />
            ) : (
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/my-orders"
          element={
            CATALOG_MODE ? (
              <Navigate to="/" replace />
            ) : (
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/track-order"
          element={
            CATALOG_MODE ? (
              <Navigate to="/" replace />
            ) : (
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/track-order/:orderId"
          element={
            CATALOG_MODE ? (
              <Navigate to="/" replace />
            ) : (
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            )
          }
        />
        {/* Redirect any other user routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Admin Routes inside AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard activeTab="overview" />} />
        <Route path="products" element={<AdminDashboard activeTab="products" />} />
        <Route path="orders" element={<AdminDashboard activeTab="orders" />} />
        <Route path="enquiries" element={<AdminDashboard activeTab="enquiries" />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}