import React, { createContext, useCallback, useContext, useState } from 'react'
import { apiRequest, clearSession, getStoredSession, storeSession } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession())
  const user = session?.user || null

  const persistSession = useCallback((nextSession) => {
    setSession(nextSession)
    storeSession(nextSession)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const nextSession = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      persistSession(nextSession)
      return { success: true, role: nextSession.user.role }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [persistSession])

  const signup = useCallback(async (name, email, password, role = 'customer') => {
    try {
      const nextSession = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      })
      persistSession(nextSession)
      return { success: true, role: nextSession.user.role }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [persistSession])

  const logout = useCallback(() => {
    if (session?.token) {
      apiRequest('/auth/logout', { method: 'POST' }).catch(() => {})
    }
    setSession(null)
    clearSession()
    localStorage.removeItem('cravedrop_user')
    localStorage.removeItem('cravedrop_all_users')
  }, [session?.token])

  const refreshCurrentUser = useCallback(async () => {
    try {
      const data = await apiRequest('/auth/me')
      const nextSession = { ...session, user: data.user }
      persistSession(nextSession)
      return { success: true, user: data.user }
    } catch (error) {
      clearSession()
      setSession(null)
      return { success: false, error: error.message }
    }
  }, [persistSession, session])

  const updateProfile = useCallback((updates) => {
    setSession(prev => {
      if (!prev) return prev
      const updated = { ...prev, user: { ...prev.user, ...updates } }
      storeSession(updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, token: session?.token || null, isAuthenticated: !!user, role: user?.role || null, login, signup, logout, refreshCurrentUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
