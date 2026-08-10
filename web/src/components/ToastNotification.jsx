import React from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export function ToastNotification({ message, onDismiss }) {
  if (!message) return null

  const isError = message.toLowerCase().includes('failed') || 
                  message.toLowerCase().includes('error') || 
                  message.toLowerCase().includes('invalid') || 
                  message.toLowerCase().includes('unauthorized')

  return (
    <aside className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 sm:px-0 toast-animate" aria-live="polite">
      <div className="flex items-center justify-between gap-3 p-3.5 bg-[#16161a] border border-white/10 rounded-xl shadow-2xl text-zinc-100 text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {isError ? (
            <AlertCircle size={16} className="text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          )}
          <span className="font-medium text-xs sm:text-sm truncate">{message}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-zinc-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  )
}
