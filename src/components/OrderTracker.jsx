import React, { useEffect } from 'react'
import { FaCheck, FaClock, FaStore, FaBoxOpen, FaMotorcycle, FaHome } from 'react-icons/fa'

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: <FaCheck />, color: 'primary' },
  { id: 'confirmed', label: 'Restaurant Confirmed', icon: <FaStore />, color: 'blue' },
  { id: 'preparing', label: 'Preparing Your Food', icon: <FaBoxOpen />, color: 'orange' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: <FaMotorcycle />, color: 'purple' },
  { id: 'delivered', label: 'Delivered', icon: <FaHome />, color: 'green' },
]

const STATUS_INDEX = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
}

const STEP_COLORS = {
  primary: { active: 'bg-primary-500 text-white', icon: 'text-primary-500' },
  blue: { active: 'bg-blue-500 text-white', icon: 'text-blue-500' },
  orange: { active: 'bg-orange-500 text-white', icon: 'text-orange-500' },
  purple: { active: 'bg-purple-500 text-white', icon: 'text-purple-500' },
  green: { active: 'bg-green-500 text-white', icon: 'text-green-500' },
}

export default function OrderTracker({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0

  return (
    <div className="space-y-1">
      {STEPS.map((step, i) => {
        const isDone = i <= currentIndex
        const isActive = i === currentIndex
        const isPending = i > currentIndex
        const cfg = STEP_COLORS[step.color]

        return (
          <div key={step.id} className="flex gap-4">
            {/* Icon + Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                isDone ? cfg.active : 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-dark-500'
              } ${isActive ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-dark-900 shadow-lg' : ''}`}
                style={isActive ? { boxShadow: '0 0 0 4px rgba(249,115,22,0.2)' } : {}}
              >
                {isDone ? step.icon : <span className="text-xs">{i + 1}</span>}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-0.5 h-8 mt-1 rounded-full transition-all duration-700 ${isDone && i < currentIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-700'}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between">
                <p className={`font-semibold text-sm transition-colors ${isDone ? 'text-dark-900 dark:text-white' : 'text-gray-400 dark:text-dark-500'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                    Active
                  </span>
                )}
                {isDone && !isActive && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Done</span>
                )}
              </div>
              {isActive && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {step.id === 'placed' && 'Waiting for restaurant confirmation...'}
                  {step.id === 'confirmed' && 'The restaurant has confirmed your order!'}
                  {step.id === 'preparing' && 'Your food is being freshly prepared 👨‍🍳'}
                  {step.id === 'out_for_delivery' && 'Your rider is on the way! 🚴'}
                  {step.id === 'delivered' && 'Enjoy your meal! 🎉'}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
