import React, { useState } from 'react'
import { FaTag, FaCheck, FaTimes } from 'react-icons/fa'
import { useCatalog } from '../contexts/CatalogContext.jsx'

export default function CouponInput({ totalAmount, onApply, appliedCoupon }) {
  const { coupons } = useCatalog()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setError('Enter a coupon code'); return }

    const coupon = coupons.find(c => c.code === trimmed)
    if (!coupon) { setError('Invalid coupon code'); setSuccess(''); return }
    if (totalAmount < coupon.minOrder) {
      setError(`Minimum order of $${coupon.minOrder} required for this coupon`)
      setSuccess('')
      return
    }

    setError('')
    setSuccess(`✓ "${coupon.code}" applied! ${coupon.description}`)
    onApply(coupon)
  }

  const handleRemove = () => {
    setCode('')
    setError('')
    setSuccess('')
    onApply(null)
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
            <FaCheck className="text-white text-xs" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">{appliedCoupon.code}</p>
            <p className="text-xs text-green-600 dark:text-green-500">{appliedCoupon.description}</p>
          </div>
        </div>
        <button onClick={handleRemove} className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors">
          <FaTimes />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
            placeholder="Enter coupon code"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-sm font-medium uppercase tracking-wider focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            onKeyDown={e => e.key === 'Enter' && handleApply()}
          />
        </div>
        <button
          onClick={handleApply}
          className="px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 shrink-0"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-red-500 text-xs flex items-center gap-1"><FaTimes className="text-xs" />{error}</p>}
      {success && <p className="text-green-600 text-xs">{success}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {coupons.slice(0, 3).map(c => (
          <button
            key={c.code}
            onClick={() => { setCode(c.code); setError('') }}
            className="text-xs px-3 py-1 rounded-lg border border-dashed border-primary-300 text-primary-600 dark:border-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium"
          >
            {c.code}
          </button>
        ))}
      </div>
    </div>
  )
}
