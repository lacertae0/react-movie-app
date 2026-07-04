import { useEffect } from 'react'

function Modal({ isOpen, onClose, title, children, autoCloseMs = 3000 }) {
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return undefined

    const timer = setTimeout(onClose, autoCloseMs)
    return () => clearTimeout(timer)
  }, [isOpen, autoCloseMs, onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-[fadeInScale_0.2s_ease-out] dark:border-gray-700 dark:bg-gray-900"
      >
        {title && (
          <h2
            id="modal-title"
            className="mb-2 text-lg font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
        )}

        <div className="text-gray-600 dark:text-gray-300">{children}</div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Modal
