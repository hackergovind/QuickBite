import React from 'react'
import { useTheme } from '../contexts/ThemeContext.jsx'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function DarkModeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
          : 'bg-gradient-to-r from-amber-400 to-orange-400'
      } ${className}`}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0.5'
        }`}
      >
        {theme === 'dark'
          ? <FaMoon className="text-indigo-600 text-xs" />
          : <FaSun className="text-amber-500 text-xs" />
        }
      </span>
    </button>
  )
}
