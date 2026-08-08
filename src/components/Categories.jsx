import React from 'react'
import { useCatalog } from '../contexts/CatalogContext.jsx'

export default function Categories({ activeCategory, onCategoryChange }) {
  const { categories } = useCatalog()

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4">
      <div className="flex gap-3 min-w-max px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              activeCategory === cat.id
                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-500 hover:text-primary-600'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
