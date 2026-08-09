import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaUserCircle, FaStore, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [tab, setTab] = useState('email')
  const [role, setRole] = useState('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please enter email and password')

    setLoading(true)
    const result = await login(email, password, role)
    setLoading(false)

    if (result.success) {
      if (result.role === 'admin') navigate('/admin', { replace: true })
      else if (result.role === 'owner') navigate('/owner-dashboard', { replace: true })
      else navigate(from, { replace: true })
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (!email) return setError('Please enter your email')
    setResetSent(true)
    setError('')
  }

  const ROLES = [
    { key: 'customer', label: 'Customer',  icon: FaUserCircle, active: 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' },
    { key: 'owner',    label: 'Owner',     icon: FaStore,      active: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
    { key: 'admin',    label: 'Admin',     icon: FaShieldAlt,  active: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center py-12 px-4 animate-fade-in transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 dark:shadow-primary-900/30">
            <span className="text-white text-2xl font-bold">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">Log in to QuickBite</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-dark-700">

          {/* Role Selector */}
          <div className="mb-5">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-center mb-3">Login as</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ key, label, icon: Icon, active }) => (
                <button key={key} type="button" onClick={() => setRole(key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 font-medium text-xs ${
                    role === key ? active : 'border-gray-100 dark:border-dark-700 text-gray-400 dark:text-gray-500 hover:border-gray-200 dark:hover:border-dark-600'
                  }`}>
                  <Icon className="text-lg" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-dark-700 mb-6">
            {[
              { id: 'email', label: 'Login' },
              { id: 'forgot', label: 'Reset Password' }
            ].map(t => (
              <button key={t.id}
                onClick={() => { setTab(t.id); setError(''); setResetSent(false) }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${tab === t.id ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                {t.label}
                {tab === t.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          {tab === 'email' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className="input-field pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className={`w-full justify-center py-3.5 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 mt-2 disabled:opacity-60 ${
                  role === 'admin' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/20'
                  : role === 'owner' ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20'
                  : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20'
                }`}>
                {loading ? 'Logging in...' : `Log In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <div className="space-y-4">
              {resetSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-2xl text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">Check your email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">We've sent password reset instructions to {email}</p>
                  <button onClick={() => setTab('email')} className="text-primary-500 font-semibold text-sm hover:underline mt-6">Back to Login</button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Enter your email address and we'll send you a link to reset your password.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com" className="input-field pl-10" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3.5">Send Reset Link</button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
