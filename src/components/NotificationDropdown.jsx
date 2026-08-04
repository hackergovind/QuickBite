import React, { useRef, useEffect } from 'react'
import { FaBell, FaTimes, FaCheckDouble, FaShoppingBag, FaTag, FaGift } from 'react-icons/fa'
import { useNotifications } from '../contexts/NotificationsContext.jsx'
import { Link } from 'react-router-dom'

const typeConfig = {
  order:  { icon: <FaShoppingBag />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  offer:  { icon: <FaTag />, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  promo:  { icon: <FaGift />, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  info:   { icon: <FaBell />, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

export default function NotificationDropdown({ onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700 z-50 overflow-hidden animate-slide-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-700">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-dark-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        <button
          onClick={markAllAsRead}
          className="text-xs text-primary-500 font-medium flex items-center gap-1 hover:underline"
        >
          <FaCheckDouble className="text-xs" /> Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-dark-800">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <FaBell className="text-3xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 8).map(n => {
            const cfg = typeConfig[n.type] || typeConfig.info
            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors relative group ${!n.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
              >
                {!n.read && <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm ${cfg.bg} ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark-900 dark:text-white leading-snug">{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.timestamp)}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); clearNotification(n.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-dark-700 text-center">
        <Link to="/notifications" onClick={onClose} className="text-sm text-primary-500 font-semibold hover:underline">
          View all notifications
        </Link>
      </div>
    </div>
  )
}
