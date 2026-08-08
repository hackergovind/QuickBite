import React, { useState, useEffect, useRef } from 'react'
import { FaSearch, FaMicrophone, FaTimes, FaHistory } from 'react-icons/fa'
import { foods as dummyFoods, restaurants as dummyRestaurants } from '../data/dummyData.js'
import { useNavigate } from 'react-router-dom'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'

// Simple NLP-style keyword matching
function parseQuery(query) {
  const q = query.toLowerCase()
  const filters = {}

  // Price filter
  const priceMatch = q.match(/under\s*\$?(\d+)/)
  if (priceMatch) filters.maxPrice = parseFloat(priceMatch[1])

  // Veg detection
  if (q.includes('veg') || q.includes('vegetarian') || q.includes('vegan')) filters.isVeg = true

  // Category detection
  if (q.includes('spicy') || q.includes('hot')) filters.spicy = true
  if (q.includes('healthy') || q.includes('salad') || q.includes('protein')) filters.category = 'healthy'
  if (q.includes('pizza')) filters.category = 'pizza'
  if (q.includes('burger')) filters.category = 'burger'
  if (q.includes('sushi')) filters.category = 'sushi'
  if (q.includes('indian') || q.includes('curry')) filters.category = 'indian'
  if (q.includes('dessert') || q.includes('sweet') || q.includes('cake')) filters.category = 'dessert'
  if (q.includes('chicken')) filters.keyword = 'chicken'
  if (q.includes('paneer')) filters.keyword = 'paneer'

  return filters
}

function getResults(query, allFoods, allRestaurants) {
  if (!query.trim()) return []
  const filters = parseQuery(query)
  const q = query.toLowerCase()

  let foodResults = allFoods.filter(f => {
    if (filters.maxPrice && f.price > filters.maxPrice) return false
    if (filters.isVeg && !f.isVeg) return false
    if (filters.category && f.category !== filters.category) return false
    if (filters.keyword && !f.name.toLowerCase().includes(filters.keyword)) return false
    if (!Object.keys(filters).length) {
      return f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
    }
    return true
  }).slice(0, 4)

  let restaurantResults = allRestaurants.filter(r =>
    r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
  ).slice(0, 2)

  return { foods: foodResults, restaurants: restaurantResults }
}

const SUGGESTIONS = [
  '🌶️ Spicy chicken',
  '🥗 Healthy lunch under $15',
  '🌿 Vegan options',
  '🍕 Best pizza',
  '💪 High protein meals',
  '🍔 Burgers under $12',
]

export default function AISearchBar({ className = '' }) {
  const { ownerRestaurants } = useRestaurantOwner()
  const allRestaurants = [...dummyRestaurants, ...ownerRestaurants]
  const allFoods = [...dummyFoods, ...ownerRestaurants.flatMap(r => r.dishes || [])]

  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (query.length > 1) {
      const t = setTimeout(() => setResults(getResults(query, allFoods, allRestaurants)), 200)
      return () => clearTimeout(t)
    } else {
      setResults(null)
    }
  }, [query, allFoods, allRestaurants])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsFocused(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser')
      return
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e) => setQuery(e.results[0][0].transcript)
    recognition.start()
  }

  const goToFood = (foodId) => {
    setQuery('')
    setIsFocused(false)
    navigate(`/food/${foodId}`)
  }

  const goToRestaurant = (rId) => {
    setQuery('')
    setIsFocused(false)
    navigate(`/restaurant/${rId}`)
  }

  const handleSuggestion = (s) => {
    const clean = s.replace(/^[^\w]*/, '').trim()
    setQuery(clean)
    inputRef.current?.focus()
  }

  const hasResults = results && (results.foods?.length > 0 || results.restaurants?.length > 0)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`flex items-center gap-3 bg-white dark:bg-dark-800 border-2 rounded-2xl px-4 py-3 transition-all duration-300 shadow-sm ${isFocused ? 'border-primary-400 shadow-primary-100 dark:shadow-primary-900/30' : 'border-gray-200 dark:border-dark-600'}`}>
        <FaSearch className="text-gray-400 text-sm shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder='Try "spicy chicken", "vegan", "under $10"...'
          className="flex-1 bg-transparent text-sm text-dark-900 dark:text-white placeholder-gray-400 focus:outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults(null) }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <FaTimes className="text-xs" />
          </button>
        )}
        <button onClick={handleVoice} className={`shrink-0 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-primary-500'}`}>
          <FaMicrophone className="text-sm" />
        </button>
      </div>

      {/* Dropdown */}
      {isFocused && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-700 z-50 overflow-hidden animate-slide-up">
          {!query && (
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                <FaHistory className="text-xs" /> Try searching for
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => handleSuggestion(s)}
                    className="text-xs px-3 py-2 bg-gray-50 dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-300 hover:text-primary-600 rounded-xl transition-colors font-medium">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasResults && (
            <div className="divide-y divide-gray-50 dark:divide-dark-800">
              {results.foods?.length > 0 && (
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Foods</p>
                  {results.foods.map(f => (
                    <button key={f.id} onClick={() => goToFood(f.id)}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors text-left group">
                      <img src={f.image} alt={f.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">{f.name}</p>
                        <p className="text-xs text-gray-400">${f.price.toFixed(2)} · {f.calories} cal</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.restaurants?.length > 0 && (
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Restaurants</p>
                  {results.restaurants.map(r => (
                    <button key={r.id} onClick={() => goToRestaurant(r.id)}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors text-left group">
                      <img src={r.image} alt={r.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.cuisine}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {query && !hasResults && (
            <div className="p-8 text-center">
              <p className="text-2xl mb-2">🤔</p>
              <p className="text-sm font-semibold text-dark-900 dark:text-white">No results for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
