import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle } from 'lucide-react'
import './toast.css'

const Toast = ({ open, message, type = 'success', onClose, duration = 2000 }) => {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => { onClose && onClose() }, duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])
  if (!open) return null
  return createPortal(
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-info'}`}>
      <div className="flex items-center gap-2">
        <CheckCircle size={18} />
        <span>{message}</span>
      </div>
    </div>,
    document.body
  )
}

export default Toast
