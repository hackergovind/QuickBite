import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaFilter, FaSortAmountDown, FaSearch } from 'react-icons/fa'
import SearchBar from '../components/SearchBar.jsx'
import Categories from '../components/Categories.jsx'
import RestaurantCard from '../components/RestaurantCard.jsx'
import { restaurants } from '../data/dummyData.js'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'

export default function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('rating')
  const { ownerRestaurants } = useRestaurantOwner()

  // Merge static + owner-created restaurants (only require name to be visible)
  const allRestaurants = useMemo(() => [
    ...restaurants,
    ...ownerRestaurants.filter(r => r.name && r.name.trim() !== ''),
  ], [ownerRestaurants])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query) {
      setSearchParams({ search: query })
    } else {
      setSearchParams({})
    }
  }

  const filteredRestaurants = useMemo(() => {
    let result = [...allRestaurants]

    if (activeCategory !== 'all') {
      result = result.filter(r => r.category === activeCategory)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'time':
        result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime))
        break
      case 'fee':
        result.sort((a, b) => a.deliveryFee - b.deliveryFee)
        break
      default:
        break
    }

    return result
  }, [activeCategory, searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-2">All Restaurants</h1>
          <p className="text-gray-500 mb-6">Discover the best food near you</p>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name or cuisine..."
          />
        </div>
      </div>

      <div className="sticky top-16 lg:top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>
            <div className="flex items-center gap-2 shrink-0 border-l border-gray-200 pl-4">
              <FaSortAmountDown className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="time">Fastest Delivery</option>
                <option value="fee">Lowest Fee</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRestaurants.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-6">{filteredRestaurants.length} restaurants found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}