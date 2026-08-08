import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaFilter, FaSearch, FaStar, FaClock, FaLeaf, FaTimes, FaChevronDown } from 'react-icons/fa'
import RestaurantCard from '../components/RestaurantCard.jsx'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'
import { useCatalog } from '../contexts/CatalogContext.jsx'

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sushi', 'Indian', 'Desserts', 'Healthy', 'Chinese', 'Mexican']
const RATINGS = [
  { id: 'any', label: 'Any Rating' },
  { id: '3', label: '3.0+ Stars' },
  { id: '4', label: '4.0+ Stars' },
  { id: '4.5', label: '4.5+ Stars' }
]
const PRICES = [
  { id: 'cheap', label: '$ (Cheap)' },
  { id: 'moderate', label: '$$ (Moderate)' },
  { id: 'premium', label: '$$$ (Premium)' }
]
const TIMES = [
  { id: 'any', label: 'Any Time' },
  { id: '30', label: 'Under 30 min' },
  { id: '45', label: '30-45 min' },
  { id: '60', label: '45+ min' }
]
const SORTS = ['Recommended', 'Rating (High to Low)', 'Delivery Time', 'Name']

export default function Restaurants() {
  const { ownerRestaurants } = useRestaurantOwner()
  const { restaurants, foods } = useCatalog()
  const allRestaurants = [...restaurants, ...ownerRestaurants]

  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [rating, setRating] = useState('any')
  const [prices, setPrices] = useState([]) // array of selected price ids
  const [time, setTime] = useState('any')
  const [freeDelivery, setFreeDelivery] = useState(false)
  const [vegOnly, setVegOnly] = useState(false)
  const [openNow, setOpenNow] = useState(false)
  const [sortBy, setSortBy] = useState('Recommended')

  const togglePrice = (id) => {
    setPrices(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const clearAll = () => {
    setSearch('')
    setCategory('All')
    setRating('any')
    setPrices([])
    setTime('any')
    setFreeDelivery(false)
    setVegOnly(false)
    setOpenNow(false)
  }

  const activeFilterCount = (category !== 'All' ? 1 : 0) + (rating !== 'any' ? 1 : 0) + prices.length + (time !== 'any' ? 1 : 0) + (freeDelivery ? 1 : 0) + (vegOnly ? 1 : 0) + (openNow ? 1 : 0)

  // Filtering Logic
  const filteredRestaurants = useMemo(() => {
    let result = allRestaurants

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q))
    }

    if (category !== 'All') {
      result = result.filter(r => r.cuisine.toLowerCase().includes(category.toLowerCase()) || r.tags?.some(t => t.toLowerCase() === category.toLowerCase()))
    }

    if (rating !== 'any') {
      result = result.filter(r => r.rating >= parseFloat(rating))
    }

    // Mock price logic: random assignment since we don't have price tiers on restaurants data directly
    // Real app would filter by average item price
    if (prices.length > 0) {
      result = result.filter(r => {
        // Just for demo purposes, hash string to price tier
        const charCode = r.name.charCodeAt(0)
        let tier = charCode % 3 === 0 ? 'cheap' : charCode % 2 === 0 ? 'moderate' : 'premium'
        return prices.includes(tier)
      })
    }

    if (time !== 'any') {
      result = result.filter(r => {
        const t = parseInt(r.deliveryTime) || 30
        if (time === '30') return t <= 30
        if (time === '45') return t > 30 && t <= 45
        if (time === '60') return t > 45
        return true
      })
    }

    if (openNow) {
      result = result.filter(r => r.isOpen !== false)
    }

    if (vegOnly) {
      // Check if restaurant has veg items
      result = result.filter(r => {
        const rFoods = r.dishes || foods.filter(f => f.restaurantId === r.id)
        return rFoods.some(f => f.isVeg)
      })
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'Rating (High to Low)') return b.rating - a.rating
      if (sortBy === 'Delivery Time') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      if (sortBy === 'Name') return a.name.localeCompare(b.name)
      return 0 // Recommended (keep original order)
    })

    return result
  }, [allRestaurants, search, category, rating, prices, time, freeDelivery, openNow, vegOnly, sortBy])

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-dark-700">
        <h3 className="font-bold text-dark-900 dark:text-white flex items-center gap-2">
          <FaFilter className="text-primary-500" /> Filters
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-gray-500 hover:text-primary-500 transition-colors">Clear All</button>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-dark-700">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-dark-900 dark:group-hover:text-white transition-colors">Open Now</span>
          <div className={`relative w-10 h-5 rounded-full transition-colors ${openNow ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-600'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${openNow ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <input type="checkbox" className="hidden" checked={openNow} onChange={() => setOpenNow(!openNow)} />
        </label>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-dark-900 dark:group-hover:text-white transition-colors flex items-center gap-2">
            Veg Options <FaLeaf className="text-green-500" />
          </span>
          <div className={`relative w-10 h-5 rounded-full transition-colors ${vegOnly ? 'bg-green-500' : 'bg-gray-200 dark:bg-dark-600'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${vegOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <input type="checkbox" className="hidden" checked={vegOnly} onChange={() => setVegOnly(!vegOnly)} />
        </label>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-bold text-dark-900 dark:text-white mb-3">Rating</p>
        <div className="space-y-2">
          {RATINGS.map(r => (
            <label key={r.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${rating === r.id ? 'border-primary-500' : 'border-gray-300 dark:border-dark-600 group-hover:border-primary-400'}`}>
                {rating === r.id && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
              </div>
              <span className={`text-sm ${rating === r.id ? 'font-semibold text-dark-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-dark-900 dark:group-hover:text-white'}`}>{r.label}</span>
              <input type="radio" className="hidden" checked={rating === r.id} onChange={() => setRating(r.id)} />
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-sm font-bold text-dark-900 dark:text-white mb-3">Price Range</p>
        <div className="flex gap-2">
          {PRICES.map(p => (
            <button
              key={p.id}
              onClick={() => togglePrice(p.id)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                prices.includes(p.id) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800' : 'bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-dark-700 hover:border-gray-300'
              }`}
            >
              {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <p className="text-sm font-bold text-dark-900 dark:text-white mb-3">Delivery Time</p>
        <div className="space-y-2">
          {TIMES.map(t => (
            <label key={t.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${time === t.id ? 'border-primary-500' : 'border-gray-300 dark:border-dark-600 group-hover:border-primary-400'}`}>
                {time === t.id && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
              </div>
              <span className={`text-sm ${time === t.id ? 'font-semibold text-dark-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-dark-900 dark:group-hover:text-white'}`}>{t.label}</span>
              <input type="radio" className="hidden" checked={time === t.id} onChange={() => setTime(t.id)} />
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-container py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Categories */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-dark-900 dark:text-white">Restaurants</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{filteredRestaurants.length} places found in New York, NY</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm text-dark-900 dark:text-white transition-all"
                />
              </div>
              <button 
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden relative p-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-600 dark:text-gray-300"
              >
                <FaFilter />
                {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 border border-gray-100 dark:border-dark-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="section-card sticky top-24">
              <FilterPanel />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-dark-900 dark:text-white">All Results</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg pl-3 pr-8 py-1.5 text-sm font-medium text-dark-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-3xl border border-gray-100 dark:border-dark-700">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">No restaurants found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">We couldn't find any restaurants matching your current filters. Try adjusting your criteria or clearing some filters.</p>
                <button onClick={clearAll} className="btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRestaurants.map(r => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative w-80 max-w-full bg-white dark:bg-dark-900 h-full shadow-2xl overflow-y-auto animate-slide-up">
            <div className="p-4 border-b border-gray-100 dark:border-dark-800 sticky top-0 bg-white/90 dark:bg-dark-900/90 backdrop-blur z-10 flex justify-between items-center">
              <h2 className="font-bold text-dark-900 dark:text-white text-lg">Filters</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-2 bg-gray-100 dark:bg-dark-800 rounded-full text-gray-600 dark:text-gray-300">
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <FilterPanel />
              <button onClick={() => setShowFiltersMobile(false)} className="btn-primary w-full justify-center mt-8 py-3.5">
                Show {filteredRestaurants.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
