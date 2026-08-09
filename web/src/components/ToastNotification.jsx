import React from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export function ToastNotification({ message, onDismiss }) {
  if (!message) return null

  const isError = message.toLowerCase().includes('failed') || 
                  message.toLowerCase().includes('error') || 
                  message.toLowerCase().includes('invalid') || 
                  message.toLowerCase().includes('unauthorized')

  return (
    <aside className="toast-container" aria-live="polite">
      <div className="toast-box">
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertCircle size={16} className="text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-sky-400 shrink-0" />
          )}
          <span className="toast-msg">{message}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="toast-dismiss-btn"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  )
}
