import React from 'react'
import { FaFire, FaLeaf, FaDrumstickBite, FaAllergies } from 'react-icons/fa'
import { GiMeat, GiWheat } from 'react-icons/gi'

export default function NutritionPanel({ food }) {
  const { calories = 0, protein = 0, carbs = 0, fat = 0, allergens = [] } = food

  const macros = [
    { label: 'Protein', value: protein, unit: 'g', color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400', icon: <GiMeat className="text-blue-500" />, pct: Math.round((protein * 4 / calories) * 100) || 0 },
    { label: 'Carbs', value: carbs, unit: 'g', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400', icon: <GiWheat className="text-amber-500" />, pct: Math.round((carbs * 4 / calories) * 100) || 0 },
    { label: 'Fat', value: fat, unit: 'g', color: 'bg-rose-500', textColor: 'text-rose-600 dark:text-rose-400', icon: <FaFire className="text-rose-500" />, pct: Math.round((fat * 9 / calories) * 100) || 0 },
  ]

  return (
    <div className="bg-gray-50 dark:bg-dark-800 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-dark-900 dark:text-white flex items-center gap-2">
        <FaLeaf className="text-green-500" /> Nutrition Info
      </h3>

      {/* Calories */}
      <div className="text-center py-3 bg-white dark:bg-dark-700 rounded-xl">
        <p className="text-3xl font-black text-dark-900 dark:text-white">{calories}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">Calories per serving</p>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3">
        {macros.map(m => (
          <div key={m.label} className="bg-white dark:bg-dark-700 rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1 text-sm">{m.icon}</div>
            <p className={`text-lg font-black ${m.textColor}`}>{m.value}<span className="text-xs font-normal">{m.unit}</span></p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{m.label}</p>
            {/* Mini bar */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-dark-600 rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(m.pct, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Allergens */}
      {allergens.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <FaAllergies className="text-amber-600" />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Contains Allergens</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergens.map(a => (
              <span key={a} className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-lg font-medium">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
