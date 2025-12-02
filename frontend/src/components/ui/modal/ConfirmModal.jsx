import Modal from './Modal'
import { useState } from 'react'

const ConfirmModal = ({
  isOpen,
  onClose,
  title = 'Confirmar acción',
  message = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  variant = 'success',
}) => {
  const [loading, setLoading] = useState(false)
  if (!isOpen) return null
  const handleConfirmClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (onConfirm) await onConfirm()
    } finally {
      setLoading(false)
      onClose && onClose()
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4 space-y-4">
        {message && (
          <p className="text-[var(--color-secondary-text)] text-sm">{message}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)]"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-[var(--color-text)] ${variant === 'danger' ? 'bg-[var(--color-error)] hover:bg-[var(--color-error-dark)]' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'} ${loading ? 'opacity-80 cursor-wait' : ''}`}
            onClick={handleConfirmClick}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Procesando...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
