import React, { createContext, useContext, useState, useCallback } from 'react'
import { apiRequest, storeSession, clearSession, getStoredSession } from '../lib/api.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'cravedrop_user'

const ADMIN_USER = {
  id: 'admin-001',
  name: 'Super Admin',
  email: 'admin@quickbite.com',
  role: 'admin',
  phone: '',
  address: '',
  avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=7c3aed&color=fff&size=100',
}

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=f97316&color=fff&size=100`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = useCallback(async (email, password, role = null) => {
    if (!email) return { success: false, error: 'Please enter your email.' }
    if (!password) return { success: false, error: 'Please enter your password.' }

    // Admin bypass
    if (email.trim().toLowerCase() === 'admin@quickbite.com' && password === 'admin123') {
      setUser(ADMIN_USER)
      localStorage.setItem(SESSION_KEY, JSON.stringify(ADMIN_USER))
      storeSession({ token: 'admin-token', user: ADMIN_USER })
      return { success: true, role: 'admin' }
    }

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      })

      const userRole = data.user?.role || 'customer'
      if (role && role !== 'admin' && userRole !== role) {
        return { success: false, error: `This account is a "${userRole}" account. Please select the correct role.` }
      }

      const sessionUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: userRole,
        phone: data.user.phone || '',
        address: data.user.address || '',
        avatar: data.user.avatar || avatarUrl(data.user.name),
      }

      storeSession({ token: data.token, user: sessionUser })
      setUser(sessionUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
      return { success: true, role: userRole }
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password.' }
    }
  }, [])

  const signup = useCallback(async (name, email, phone, password, role = 'customer') => {
    if (!name || !email || !password) return { success: false, error: 'All fields are required.' }

    try {
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, role, phone: phone || '' })
      })

      const sessionUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone || '',
        address: data.user.address || '',
        avatar: data.user.avatar || avatarUrl(name),
      }

      storeSession({ token: data.token, user: sessionUser })
      setUser(sessionUser)
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
      return { success: true, role: sessionUser.role }
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed. Please try again.' }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    clearSession()
  }, [])

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const refreshCurrentUser = useCallback(() => Promise.resolve({ success: true, user }), [user])

  return (
    <AuthContext.Provider value={{
      user,
      token: getStoredSession()?.token || null,
      isAuthenticated: !!user,
      role: user?.role || null,
      login,
      signup,
      logout,
      updateProfile,
      refreshCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
