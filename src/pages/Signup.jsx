import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaUserCircle, FaStore } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Signup() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()

  const [step, setStep] = useState(1) // 1: details, 2: otp
  const [role, setRole] = useState('customer') // customer, owner
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState(null)
  const [countdown, setCountdown] = useState(0)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    let timer
    if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const sendVerificationEmail = async (code) => {
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send verification email')
      return true
    } catch (err) {
      console.error(err)
      setError(err.message || 'Server error. Is the backend running?')
      return false
    }
  }

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) return setError('Please fill in all required fields')
    
    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address')

    setLoading(true)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    
    const sent = await sendVerificationEmail(newOtp)
    setLoading(false)

    if (sent) {
      setStep(2)
      setCountdown(60)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setLoading(true)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    const sent = await sendVerificationEmail(newOtp)
    setLoading(false)
    if (sent) setCountdown(60)
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')
    const enteredOtp = otp.join('')
    if (enteredOtp.length < 6) return setError('Please enter the full 6-digit code')
    
    if (enteredOtp !== generatedOtp) {
      return setError('Invalid verification code. Please try again.')
    }

    // Success! Create the account
    setLoading(true)
    const result = signup(name, email, phone, password, role)
    setLoading(false)

    if (result.success) {
      if (result.role === 'owner') navigate('/owner-dashboard', { replace: true })
      else navigate(from, { replace: true })
    } else {
      setError(result.error || 'Signup failed after verification')
    }
  }

  const handleGoogleSignup = () => {
    setError('Google sign-up is not available yet')
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

          {step === 1 ? (
            <>
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

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
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
                      placeholder="+1 (555) 000-0000" className="input-field pl-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
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
                    role === 'owner' ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20'
                    : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20'
                  }`}>
                  {loading ? 'Sending Code...' : `Verify Email`}
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100 dark:bg-dark-700" />
                  <span className="text-xs text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-dark-700" />
                </div>

                <button type="button" onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-dark-900 dark:text-white font-semibold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors shadow-sm">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Sign up with Google
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">Check your email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We sent a 6-digit verification code to<br/>
                  <span className="font-bold text-gray-900 dark:text-white">{email}</span>
                </p>
                <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']) }} className="text-xs text-primary-500 hover:underline mt-2 font-medium">
                  Change email address
                </button>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input key={i} type="text" maxLength={1} value={digit} id={`otp-${i}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp)
                      if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
                    }}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus() }}
                    className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  />
                ))}
              </div>

              <button type="submit" disabled={loading}
                className={`w-full justify-center py-3.5 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 mt-2 disabled:opacity-60 ${
                  role === 'owner' ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20'
                  : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20'
                }`}>
                {loading ? 'Verifying...' : `Complete Sign Up`}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Didn't receive code?{' '}
                {countdown > 0 ? <span>Resend in {countdown}s</span>
                  : <button type="button" onClick={handleResendOtp} disabled={loading} className="text-primary-500 hover:underline font-semibold disabled:opacity-50">Resend Now</button>}
              </p>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:underline">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
