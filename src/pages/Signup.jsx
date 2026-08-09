import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaUserCircle, FaStore } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()

  const [role, setRole] = useState('customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) return setError('Please fill in all required fields')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address')
    if (password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    const result = await signup(name, email, phone, password, role)
    setLoading(false)

    if (result.success) {
      if (result.role === 'owner') navigate('/owner-dashboard', { replace: true })
      else navigate(from, { replace: true })
    } else {
      setError(result.error || 'Signup failed. Please try again.')
    }
  }

  const ROLES = [
    { key: 'customer', label: 'Customer', icon: FaUserCircle, active: 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' },
    { key: 'owner',    label: 'Restaurant Owner', icon: FaStore, active: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center py-12 px-4 animate-fade-in transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900/30">
            <span className="text-white text-2xl font-bold">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join QuickBite today</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-dark-700">

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-center mb-3">Sign up as</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ key, label, icon: Icon, active }) => (
                <button key={key} type="button" onClick={() => setRole(key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 font-semibold ${
                    role === key ? active : 'border-gray-100 dark:border-dark-700 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-dark-600'
                  }`}>
                  <Icon className="text-2xl" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99999 00000" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full justify-center py-3.5 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 mt-2 disabled:opacity-60 ${
                role === 'owner'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20'
                  : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20'
              }`}>
              {loading ? 'Creating Account...' : `Create ${role === 'owner' ? 'Owner' : ''} Account`}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
