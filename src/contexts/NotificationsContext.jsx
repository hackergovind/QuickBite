import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const NotificationsContext = createContext(null)

const SEED = [
  { id: 'n1', type: 'offer', title: '🔥 Flash Sale!', message: 'Get 30% off all pizzas for the next 2 hours. Use code PIZZA30', read: false, timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'n2', type: 'order', title: '✅ Order Confirmed', message: 'Your order from Burger Kingpin has been confirmed!', read: false, timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'n3', type: 'promo', title: '🎁 You earned 50 points!', message: 'Keep ordering to unlock Silver tier rewards.', read: true, timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'n4', type: 'offer', title: '🆕 New Restaurant Alert', message: 'Sakura Sushi just joined QuickBite. Try them today!', read: true, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
]

function loadNotifications() {
  try {
    const data = localStorage.getItem('qb_notifications')
    return data ? JSON.parse(data) : SEED
  } catch { return SEED }
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(loadNotifications)

  useEffect(() => {
    localStorage.setItem('qb_notifications', JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback(({ type = 'info', title, message }) => {
    const n = { id: `n-${Date.now()}`, type, title, message, read: false, timestamp: new Date().toISOString() }
    setNotifications(prev => [n, ...prev])
    return n.id
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
