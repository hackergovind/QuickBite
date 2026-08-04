import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaCheck } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const [tab, setTab] = useState('email') // email, otp, forgot
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(0)
  const [resetSent, setResetSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please enter email and password')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate(location.state?.from?.pathname || (result.role === 'owner' ? '/owner-dashboard' : '/'))
    } else {
      setError(result.error)
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    setTimeout(() => {
      setError('Google sign-in is not connected to the backend yet')
      setGoogleLoading(false)
    }, 600)
  }

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!phone) return setError('Please enter your phone number')
    setOtpSent(true)
    setCountdown(60)
    setError('')
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return setError('Please enter the full 6-digit code')
    setError('Phone OTP sign-in is not connected to the backend yet')
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (!email) return setError('Please enter your email')
    setResetSent(true)
    setError('')
  }

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
          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-dark-700 mb-6">
            {[
              { id: 'email', label: 'Email' },
              { id: 'otp', label: 'Phone' },
              { id: 'forgot', label: 'Reset' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(''); setResetSent(false); setOtpSent(false) }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${tab === t.id ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                {t.label}
                {tab === t.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Email Login Tab */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60">
                {loading ? 'Logging in...' : 'Log In'}
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100 dark:bg-dark-700" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-dark-700" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 text-dark-900 dark:text-white font-semibold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors shadow-sm disabled:opacity-50"
              >
                {googleLoading ? 'Signing in...' : (
                  <>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP Login Tab */}
          {tab === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3.5">
                    Send Verification Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Code sent to <span className="font-bold">{phone}</span></p>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-primary-500 hover:underline mt-1">Change number</button>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          const newOtp = [...otp]
                          newOtp[i] = val
                          setOtp(newOtp)
                          if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && i > 0) {
                            document.getElementById(`otp-${i - 1}`)?.focus()
                          }
                        }}
                        id={`otp-${i}`}
                        className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-3.5">
                    Verify Code
                  </button>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive code?{' '}
                    {countdown > 0 ? (
                      <span>Resend in {countdown}s</span>
                    ) : (
                      <button type="button" onClick={() => setCountdown(60)} className="text-primary-500 hover:underline font-semibold">Resend Now</button>
                    )}
                  </p>
                </form>
              )}
            </div>
          )}

          {/* Forgot Password Tab */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              {resetSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-2xl text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">Check your email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We've sent password reset instructions to {email}
                  </p>
                  <button onClick={() => setTab('email')} className="text-primary-500 font-semibold text-sm hover:underline mt-6">
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-3.5">
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
