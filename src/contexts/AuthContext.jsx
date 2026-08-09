import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

const SESSION_KEY = 'cravedrop_user'

const ADMIN_EMAIL = 'admin@quickbite.com'
const ADMIN_PASSWORD = 'admin123'
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

  // Listen to Supabase auth state changes (handles session restore on refresh)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        const sessionUser = {
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || session.user.email,
          email: session.user.email,
          role: profile?.role || session.user.user_metadata?.role || 'customer',
          phone: profile?.phone || session.user.user_metadata?.phone || '',
          address: profile?.address || '',
          avatar: profile?.avatar || avatarUrl(profile?.name || session.user.email),
        }
        setUser(sessionUser)
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
      } else if (event === 'SIGNED_OUT') {
        // Only clear if not admin (admin uses localStorage)
        const saved = localStorage.getItem(SESSION_KEY)
        const savedUser = saved ? JSON.parse(saved) : null
        if (savedUser?.id !== 'admin-001') {
          setUser(null)
          localStorage.removeItem(SESSION_KEY)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password, role = null) => {
    if (!email) return { success: false, error: 'Please enter your email.' }
    if (!password) return { success: false, error: 'Please enter your password.' }

    // Admin bypass — never goes to Supabase
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser(ADMIN_USER)
      localStorage.setItem(SESSION_KEY, JSON.stringify(ADMIN_USER))
      return { success: true, role: 'admin' }
    }

    // Regular users via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password.' }
      }
      return { success: false, error: error.message }
    }

    // Fetch profile for role/extra data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const userRole = profile?.role || data.user.user_metadata?.role || 'customer'

    // Role check if specified
    if (role && role !== 'admin' && userRole !== role) {
      await supabase.auth.signOut()
      return { success: false, error: `This account is a "${userRole}" account. Please select the correct role.` }
    }

    const sessionUser = {
      id: data.user.id,
      name: profile?.name || data.user.user_metadata?.name || data.user.email,
      email: data.user.email,
      role: userRole,
      phone: profile?.phone || '',
      address: profile?.address || '',
      avatar: profile?.avatar || avatarUrl(profile?.name || data.user.email),
    }

    setUser(sessionUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return { success: true, role: userRole }
  }, [])

  const signup = useCallback(async (name, email, phone, password, role = 'customer') => {
    if (!name || !email || !password) return { success: false, error: 'All fields are required.' }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim(), role, phone: phone || '' }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists.' }
      }
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Signup failed. Please try again.' }
    }

    // Manually upsert the profile in case the trigger hasn't fired yet
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name: name.trim(),
      role,
      phone: phone || '',
    }, { onConflict: 'id' })

    const sessionUser = {
      id: data.user.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      phone: phone || '',
      address: '',
      avatar: avatarUrl(name),
    }

    setUser(sessionUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return { success: true, role }
  }, [])

  const logout = useCallback(async () => {
    if (user?.id === 'admin-001') {
      setUser(null)
      localStorage.removeItem(SESSION_KEY)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [user])

  const updateProfile = useCallback(async (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
      return updated
    })

    if (user?.id && user.id !== 'admin-001') {
      await supabase.from('profiles').update({
        name: updates.name,
        phone: updates.phone,
        address: updates.address,
        avatar: updates.avatar,
      }).eq('id', user.id)
    }
  }, [user])

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
