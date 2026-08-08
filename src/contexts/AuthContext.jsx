import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'cravedrop_all_users'
const SESSION_KEY = 'cravedrop_user'

// ─── Seed default admin at module load (runs before React mounts) ───────────
;(function seedAdmin() {
  try {
    const all = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (!all.find(u => u.email === 'admin@quickbite.com')) {
      all.push({
        id: 'admin-001',
        name: 'Super Admin',
        email: 'admin@quickbite.com',
        phone: '+10000000000',
        role: 'admin',
        status: 'active',
        password: 'admin123',
        avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=f97316&color=fff&size=100',
        joinedAt: new Date().toISOString(),
      })
      localStorage.setItem(USERS_KEY, JSON.stringify(all))
    }
  } catch (e) {}
})()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = useCallback((email, password, role = null) => {
    if (!email) return { success: false, error: 'Please enter your email.' }
    if (!password) return { success: false, error: 'Please enter your password.' }

    const allUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = allUsers.find(
      u => u.email?.toLowerCase() === email.trim().toLowerCase()
    )

    if (!found) return { success: false, error: 'Account not found. Please sign up first.' }

    // If a role is specified (from role selector), check it matches (admin bypasses this)
    if (role && found.role !== 'admin' && found.role !== role) {
      return { success: false, error: `This account is a "${found.role}" account. Please select the correct role.` }
    }

    if (found.status === 'banned') {
      return { success: false, error: 'Your account has been banned. Contact support.' }
    }

    // Password check — stored password takes priority
    if (found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password.' }
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone || '',
      address: found.address || '',
      avatar: found.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name || 'User')}&background=f97316&color=fff&size=100`,
    }
    setUser(sessionUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return { success: true, role: found.role }
  }, [])

  const signup = useCallback((name, email, phone, password, role = 'customer') => {
    if (!name || !email || !password) return { success: false, error: 'All fields are required.' }

    const allUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (allUsers.find(u => u.email?.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      password,
      role,
      status: 'active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=f97316&color=fff&size=100`,
      address: '',
      joinedAt: new Date().toISOString(),
    }
    allUsers.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers))

    const sessionUser = { ...newUser }
    delete sessionUser.password
    setUser(sessionUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return { success: true, role }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      try {
        const all = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
        const idx = all.findIndex(u => u.id === prev.id)
        if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; localStorage.setItem(USERS_KEY, JSON.stringify(all)) }
      } catch {}
      return updated
    })
  }, [])

  // Kept for legacy compatibility — not used in UI anymore
  const refreshCurrentUser = useCallback(() => Promise.resolve({ success: true, user }), [user])

  return (
    <AuthContext.Provider value={{
      user,
      token: null,
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
