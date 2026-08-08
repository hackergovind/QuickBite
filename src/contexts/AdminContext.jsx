import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { restaurants as staticRestaurants, foods as staticFoods } from '../data/dummyData.js'

const AdminContext = createContext(null)

const KEYS = {
  users:       'cravedrop_all_users',
  restaurants: 'cravedrop_owner_restaurants',
  orders:      'quickbite_orders',
  settings:    'qb_admin_settings',
  activityLog: 'qb_admin_log',
  announcement:'qb_announcement',
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function load(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)) }

// ─── Provider ───────────────────────────────────────────────────────────────
export function AdminProvider({ children }) {
  const [users,        setUsers]        = useState(() => load(KEYS.users, []))
  const [ownerRests,   setOwnerRests]   = useState(() => load(KEYS.restaurants, []))
  const [orders,       setOrders]       = useState(() => load(KEYS.orders, []))
  const [settings,     setSettings]     = useState(() => load(KEYS.settings, { platformName: 'QuickBite', commission: 10 }))
  const [activityLog,  setActivityLog]  = useState(() => load(KEYS.activityLog, []))
  const [announcement, setAnnouncement] = useState(() => localStorage.getItem(KEYS.announcement) || '')

  // sync to localStorage on any state change
  useEffect(() => save(KEYS.users, users),              [users])
  useEffect(() => save(KEYS.restaurants, ownerRests),   [ownerRests])
  useEffect(() => save(KEYS.orders, orders),             [orders])
  useEffect(() => save(KEYS.settings, settings),         [settings])
  useEffect(() => save(KEYS.activityLog, activityLog),   [activityLog])
  useEffect(() => localStorage.setItem(KEYS.announcement, announcement), [announcement])

  // ── Activity logger
  const logAction = useCallback((msg) => {
    const entry = { id: Date.now(), msg, time: new Date().toISOString() }
    setActivityLog(prev => [entry, ...prev].slice(0, 50))
  }, [])

  // ── Combined restaurants (static + owner-created)
  const allRestaurants = [
    ...staticRestaurants.map(r => ({
      ...r,
      status: r.status || 'approved',
      ownerId: r.ownerId || 'static',
      ownerName: r.ownerName || 'QuickBite Team',
      isOwnerCreated: false,
    })),
    ...ownerRests.map(r => ({
      ...r,
      status: r.status || 'pending',
    })),
  ]

  // ── Combined dishes (static foods + owner dishes)
  const allDishes = [
    ...staticFoods.map(f => ({ ...f, isStatic: true })),
    ...ownerRests.flatMap(r => (r.dishes || []).map(d => ({ ...d, isStatic: false, restaurantName: r.name }))),
  ]

  // ── Analytics
  const analytics = {
    totalUsers: users.length,
    totalRestaurants: allRestaurants.length,
    pendingRestaurants: ownerRests.filter(r => r.status === 'pending').length,
    bannedUsers: users.filter(u => u.status === 'banned').length,
    totalOrders: orders.length,
    activeOrders: orders.filter(o => !['delivered','cancelled'].includes(o.status)).length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0),
    recentOrders: [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)).slice(0, 5),
  }

  // ─── User management ─────────────────────────────────────────────────────
  const banUser = useCallback((userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u))
    logAction(`Banned user ${userId}`)
  }, [logAction])

  const unbanUser = useCallback((userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u))
    logAction(`Unbanned user ${userId}`)
  }, [logAction])

  const deleteUser = useCallback((userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    logAction(`Deleted user ${userId}`)
  }, [logAction])

  const updateUserRole = useCallback((userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    logAction(`Changed role of ${userId} to ${newRole}`)
  }, [logAction])

  // ─── Restaurant management ───────────────────────────────────────────────
  const approveRestaurant = useCallback((rId) => {
    setOwnerRests(prev => prev.map(r => r.id === rId ? { ...r, status: 'approved' } : r))
    logAction(`Approved restaurant ${rId}`)
  }, [logAction])

  const suspendRestaurant = useCallback((rId) => {
    setOwnerRests(prev => prev.map(r => r.id === rId ? { ...r, status: 'suspended' } : r))
    logAction(`Suspended restaurant ${rId}`)
  }, [logAction])

  const deleteRestaurant = useCallback((rId) => {
    setOwnerRests(prev => prev.filter(r => r.id !== rId))
    logAction(`Deleted restaurant ${rId}`)
  }, [logAction])

  // ─── Dish management (only for owner restaurants) ────────────────────────
  const adminAddDish = useCallback((restaurantId, dish) => {
    const newDish = {
      id: `dish-admin-${Date.now()}`,
      restaurantId,
      name: dish.name || 'New Dish',
      description: dish.description || '',
      price: parseFloat(dish.price) || 0,
      category: dish.category || 'other',
      calories: parseInt(dish.calories) || 0,
      isVeg: dish.isVeg || false,
      image: dish.image || '',
      rating: 0,
      tags: dish.tags || [],
      available: true,
    }
    setOwnerRests(prev => prev.map(r =>
      r.id === restaurantId ? { ...r, dishes: [...(r.dishes || []), newDish] } : r
    ))
    logAction(`Admin added dish "${newDish.name}" to ${restaurantId}`)
  }, [logAction])

  const adminUpdateDish = useCallback((restaurantId, dishId, data) => {
    setOwnerRests(prev => prev.map(r =>
      r.id === restaurantId
        ? { ...r, dishes: r.dishes.map(d => d.id === dishId ? { ...d, ...data, price: parseFloat(data.price ?? d.price) } : d) }
        : r
    ))
    logAction(`Admin updated dish ${dishId}`)
  }, [logAction])

  const adminDeleteDish = useCallback((restaurantId, dishId) => {
    setOwnerRests(prev => prev.map(r =>
      r.id === restaurantId ? { ...r, dishes: r.dishes.filter(d => d.id !== dishId) } : r
    ))
    logAction(`Admin deleted dish ${dishId}`)
  }, [logAction])

  const adminUpdateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    logAction(`Admin updated order ${orderId} status to ${status}`)
  }, [logAction])

  const updateSettings = useCallback((s) => {
    setSettings(prev => ({ ...prev, ...s }))
  }, [])

  return (
    <AdminContext.Provider value={{
      users, allRestaurants, allDishes, orders, settings, activityLog, announcement,
      analytics,
      banUser, unbanUser, deleteUser, updateUserRole,
      approveRestaurant, suspendRestaurant, deleteRestaurant,
      adminAddDish, adminUpdateDish, adminDeleteDish,
      adminUpdateOrderStatus,
      updateSettings,
      setAnnouncement,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
