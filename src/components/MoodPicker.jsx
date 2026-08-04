import React from 'react'
import { moodCategories } from '../data/dummyData.js'

export default function MoodPicker({ onSelect }) {
  return (
    <section className="py-12 bg-white dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white mb-2">
            What's your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">mood</span> today?
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Let your cravings guide you</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {moodCategories.map(mood => (
            <button
              key={mood.id}
              onClick={() => onSelect(mood)}
              className="group relative overflow-hidden rounded-2xl p-5 text-center hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
              <div className="relative">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {mood.emoji}
                </div>
                <p className="text-sm font-bold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                  {mood.label}
                </p>
              </div>
              {/* Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-opacity-50 transition-all`}
                style={{ borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1` }} />
              <div className="absolute inset-0 rounded-2xl border border-gray-100 dark:border-dark-700 group-hover:border-transparent transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
