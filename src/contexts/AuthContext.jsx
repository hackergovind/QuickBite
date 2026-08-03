import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cravedrop_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((email, password) => {
    // Check if this email was registered as a restaurant owner
    const allUsers = JSON.parse(localStorage.getItem('cravedrop_all_users') || '[]')
    const existingUser = allUsers.find(u => u.email === email)

    const role = existingUser?.role || 'customer'
    const name = existingUser?.name || 'User'

    const mockUser = {
      id: existingUser?.id || Date.now().toString(),
      name,
      email,
      role,
      avatar: existingUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      phone: existingUser?.phone || '',
      address: existingUser?.address || ''
    }
    setUser(mockUser)
    localStorage.setItem('cravedrop_user', JSON.stringify(mockUser))
    return { success: true, role }
  }, [])

  const signup = useCallback((name, email, password, role = 'customer') => {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      phone: '',
      address: ''
    }

    // Store in all users registry
    const allUsers = JSON.parse(localStorage.getItem('cravedrop_all_users') || '[]')
    const exists = allUsers.find(u => u.email === email)
    if (!exists) {
      allUsers.push(newUser)
      localStorage.setItem('cravedrop_all_users', JSON.stringify(allUsers))
    }

    setUser(newUser)
    localStorage.setItem('cravedrop_user', JSON.stringify(newUser))
    return { success: true, role }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('cravedrop_user')
  }, [])

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('cravedrop_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role: user?.role || null, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}