import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isLoading, showToast } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <svg className="animate-spin h-10 w-10 text-brand-blue mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-slate-500">Loading your profile...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Show warning toast and redirect to Home where they can log in
    showToast("Please login to continue shopping", "warning")
    return <Navigate to="/" replace />
  }

  if (adminOnly && user?.role !== "admin") {
    // Block non-admin and redirect to Home
    showToast("Access denied. Admin authorization required.", "error")
    return <Navigate to="/" replace />
  }

  return children
}
