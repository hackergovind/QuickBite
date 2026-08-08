import React, { useState } from 'react'
import { FaMotorcycle } from 'react-icons/fa'

const PRESET_TIPS = [
  { label: 'No Tip', value: 0 },
  { label: '₹10', value: 10 },
  { label: '₹20', value: 20 },
  { label: '₹50', value: 50 },
]

export default function TipSelector({ tip, onChange }) {
  const [isCustom, setIsCustom] = useState(false)
  const [customVal, setCustomVal] = useState('')

  const handlePreset = (val) => {
    setIsCustom(false)
    setCustomVal('')
    onChange(val)
  }

  const handleCustom = () => {
    setIsCustom(true)
    onChange(0)
  }

  const handleCustomChange = (e) => {
    const val = parseFloat(e.target.value) || 0
    setCustomVal(e.target.value)
    onChange(val)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
          <FaMotorcycle className="text-orange-500 text-sm" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dark-900 dark:text-white">Tip your delivery partner</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">100% goes directly to your rider</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESET_TIPS.map(t => (
          <button
            key={t.label}
            onClick={() => handlePreset(t.value)}
            className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
              !isCustom && tip === t.value
                ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200'
                : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={handleCustom}
          className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
            isCustom
              ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200'
              : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'
          }`}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
          <input
            type="number"
            min="0"
            max="50"
            step="0.5"
            value={customVal}
            onChange={handleCustomChange}
            placeholder="0.00"
            autoFocus
            className="w-full pl-7 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      )}

      {tip > 0 && (
        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
          🙏 Thanks for tipping ₹{tip.toFixed(2)}! Your rider will appreciate it.
        </p>
      )}
    </div>
  )
}
