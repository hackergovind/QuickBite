import React, { useState } from 'react'
import { FaSearch, FaSlidersH } from 'react-icons/fa'

export default function SearchBar({ onSearch, placeholder = "Search restaurants, cuisines..." }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-4 text-gray-400 text-lg" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onSearch?.(e.target.value)
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-14 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-300 shadow-sm text-gray-700 placeholder-gray-400"
        />
        <button
          type="button"
          className="absolute right-3 p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-colors"
        >
          <FaSlidersH />
        </button>
      </div>
    </form>
  )
}