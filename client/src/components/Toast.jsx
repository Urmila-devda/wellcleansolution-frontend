import React from "react"
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"

export default function ToastContainer() {
  const { toasts } = useAuth()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = "bg-white border-brand-green"
        let iconColor = "text-brand-green"
        let Icon = FiCheckCircle

        if (toast.type === "error" || toast.type === "warning") {
          bgColor = "bg-white border-amber-500"
          iconColor = "text-amber-500"
          Icon = FiAlertCircle
        } else if (toast.type === "info") {
          bgColor = "bg-white border-brand-blue"
          iconColor = "text-brand-blue"
          Icon = FiInfo
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border-l-4 ${bgColor} animate-slide-in-right font-sans`}
            role="alert"
          >
            <Icon className={`text-xl flex-shrink-0 ${iconColor}`} />
            <div className="flex-1 text-slate-700 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
          </div>
        )
      })}
    </div>
  )
}
