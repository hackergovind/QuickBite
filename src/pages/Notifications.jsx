import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaCheckDouble, FaBell, FaTimes, FaShoppingBag, FaTag, FaGift } from 'react-icons/fa'
import { useNotifications } from '../contexts/NotificationsContext.jsx'

const TYPE_CONFIG = {
  order:  { icon: <FaShoppingBag />, color: 'border-blue-500', bg: 'bg-blue-100 text-blue-500 dark:bg-blue-900/30' },
  offer:  { icon: <FaTag />, color: 'border-orange-500', bg: 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' },
  promo:  { icon: <FaGift />, color: 'border-purple-500', bg: 'bg-purple-100 text-purple-500 dark:bg-purple-900/30' },
  info:   { icon: <FaBell />, color: 'border-gray-500', bg: 'bg-gray-100 text-gray-500 dark:bg-gray-800' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications()
  const [filter, setFilter] = useState('all') // all, unread, orders, offers

  let filtered = notifications
  if (filter === 'unread') filtered = notifications.filter(n => !n.read)
  else if (filter === 'orders') filtered = notifications.filter(n => n.type === 'order')
  else if (filter === 'offers') filtered = notifications.filter(n => n.type === 'offer' || n.type === 'promo')

  return (
    <div className="page-container pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-colors">
              <FaArrowLeft className="text-dark-900 dark:text-white" />
            </Link>
            <h1 className="text-xl font-bold text-dark-900 dark:text-white">Notifications</h1>
          </div>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllAsRead} className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-2">
              <FaCheckDouble /> <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
          {['all', 'unread', 'orders', 'offers'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-dark-900 text-white dark:bg-white dark:text-dark-900'
                  : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-700 hover:border-gray-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-3xl border border-gray-100 dark:border-dark-700">
            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-3xl text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-2">No Notifications</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">You're all caught up! We'll notify you when something happens.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info
              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`bg-white dark:bg-dark-800 rounded-2xl p-4 sm:p-5 flex gap-4 cursor-pointer transition-all border-l-4 group hover:shadow-md ${
                    !n.read ? 'border-primary-500 shadow-sm' : `border-transparent ${cfg.color.replace('border-', 'hover:border-')}`
                  } border-t border-r border-b border-gray-100 dark:border-dark-700`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl ${cfg.bg}`}>
                    {cfg.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`text-sm sm:text-base line-clamp-1 ${!n.read ? 'font-bold text-dark-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-200'}`}>
                        {n.title}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className={`text-sm mt-1 line-clamp-2 ${!n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {n.message}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between shrink-0">
                    {!n.read && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-1" />}
                    <button
                      onClick={e => { e.stopPropagation(); clearNotification(n.id) }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 -mr-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Preferences Section */}
        <div className="mt-12 bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-dark-700">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            {[
              { id: 'push', label: 'Push Notifications', desc: 'Receive notifications on your device' },
              { id: 'orders', label: 'Order Updates', desc: 'Real-time tracking and status changes' },
              { id: 'offers', label: 'Offers & Deals', desc: 'Exclusive discounts and promos' }
            ].map(pref => (
              <div key={pref.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark-900 dark:text-white">{pref.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={pref.id !== 'offers'} />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
