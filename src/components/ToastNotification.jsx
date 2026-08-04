import React, { useEffect, useRef } from 'react'
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

const ICONS = {
  success: <FaCheckCircle className="text-green-500" />,
  error: <FaTimesCircle className="text-red-500" />,
  info: <FaInfoCircle className="text-blue-500" />,
  warning: <FaExclamationTriangle className="text-amber-500" />,
}

const BG = {
  success: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
  error: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
  info: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800',
  warning: 'border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800',
}

export function Toast({ id, type = 'info', title, message, onClose }) {
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onClose(id), 4000)
    return () => clearTimeout(timerRef.current)
  }, [id, onClose])

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl max-w-sm w-full animate-slide-up ${BG[type]}`}>
      <span className="text-lg shrink-0 mt-0.5">{ICONS[type]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-bold text-dark-900 dark:text-white leading-snug">{title}</p>}
        {message && <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{message}</p>}
      </div>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
        <FaTimes className="text-xs" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
