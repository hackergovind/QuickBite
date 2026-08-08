import React, { useState } from 'react'
import { FaPepperHot, FaCheese, FaLeaf, FaTimes } from 'react-icons/fa'

const SPICY_LEVELS = [
  { id: 'mild', label: 'Mild 🌿', desc: 'No heat' },
  { id: 'medium', label: 'Medium 🌶️', desc: 'Moderate spice' },
  { id: 'hot', label: 'Hot 🔥', desc: 'Extra spicy' },
]

export default function FoodCustomizer({ food, onConfirm, onClose }) {
  const [extraCheese, setExtraCheese] = useState(false)
  const [spicyLevel, setSpicyLevel] = useState('mild')
  const [removeOnion, setRemoveOnion] = useState(false)

  const extraCost = extraCheese ? 1.50 : 0
  const totalPrice = food.price + extraCost

  const handleAdd = () => {
    onConfirm({
      ...food,
      id: `${food.id}-${Date.now()}`,
      customizations: { extraCheese, spicyLevel, removeOnion },
      price: totalPrice,
      displayName: food.name + (extraCheese ? ' +Cheese' : '') + (removeOnion ? ' -Onion' : '') + (spicyLevel !== 'mild' ? ` (${spicyLevel})` : ''),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-dark-900 rounded-3xl w-full max-w-md shadow-2xl animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Food image header */}
        <div className="relative h-40">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center hover:bg-white transition-colors">
            <FaTimes className="text-gray-600 text-sm" />
          </button>
          <div className="absolute bottom-4 left-5">
            <h3 className="text-white font-bold text-lg">{food.name}</h3>
            <p className="text-white/80 text-sm">₹{food.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Customize your order</p>

          {/* Extra Cheese */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-xl">🧀</div>
              <div>
                <p className="font-semibold text-dark-900 dark:text-white text-sm">Extra Cheese</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Double the goodness</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary-500">+₹1.50</span>
              <button
                onClick={() => setExtraCheese(!extraCheese)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${extraCheese ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${extraCheese ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Remove Onion */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-xl">🧅</div>
              <div>
                <p className="font-semibold text-dark-900 dark:text-white text-sm">Remove Onion</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Leave out the onion</p>
              </div>
            </div>
            <button
              onClick={() => setRemoveOnion(!removeOnion)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${removeOnion ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${removeOnion ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Spicy Level */}
          <div>
            <p className="text-sm font-semibold text-dark-900 dark:text-white mb-3">Spice Level</p>
            <div className="grid grid-cols-3 gap-2">
              {SPICY_LEVELS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSpicyLevel(s.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    spicyLevel === s.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-primary-300'
                  }`}
                >
                  <p className="text-xs font-bold text-dark-900 dark:text-white">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className="btn-primary w-full justify-between text-base py-4"
          >
            <span>Add to Cart</span>
            <span className="font-black">₹{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
