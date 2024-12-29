// Simplified version of use-toast
import { useState } from 'react'

export interface Toast {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (newToast: Toast) => {
    setToast(newToast)
    setTimeout(() => setToast(null), 5000) // Auto-hide after 5 seconds
  }

  return { toast, showToast }
}

