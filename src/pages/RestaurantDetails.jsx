import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaStar, FaClock, FaMotorcycle, FaArrowLeft, FaMapMarkerAlt, FaPhone, FaHeart } from 'react-icons/fa'
import FoodCard from '../components/FoodCard.jsx'
import { restaurants, foods } from '../data/dummyData.js'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'

export default function RestaurantDetails() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('all')
  const [isLiked, setIsLiked] = useState(false)
  const [sortBy, setSortBy] = useState('recommended')
  const [showNonVeg, setShowNonVeg] = useState(true)
  const { ownerRestaurants } = useRestaurantOwner()

  // Merge static + owner restaurants for lookup
  const allRestaurants = [...restaurants, ...ownerRestaurants]
  const allFoods = [...foods, ...ownerRestaurants.flatMap(r => r.dishes || [])]

  const restaurant = allRestaurants.find(r => r.id === id)
  const restaurantFoods = allFoods.filter(f => f.restaurantId === id)

  const foodCategories = ['all', ...new Set(restaurantFoods.map(f => f.category))]

  // Apply filters and sorting
  let filteredFoods = activeTab === 'all'
    ? restaurantFoods
    : restaurantFoods.filter(f => f.category === activeTab)

  // Veg / Non-Veg filter
  if (!showNonVeg) {
    filteredFoods = filteredFoods.filter(f => f.isVeg)
  }

  // Sorting
  filteredFoods = [...filteredFoods].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0 // recommended (default)
  })

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Restaurant not found</h2>
          <Link to="/restaurants" className="text-primary-500 hover:underline">Back to restaurants</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <FaArrowLeft className="text-dark-900" />
        </Link>

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg"
        >
          <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {restaurant.badge && (
              <span className="inline-block bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                {restaurant.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <p className="text-white/80 mb-4">{restaurant.cuisine}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <FaStar className="text-yellow-400" />
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-white/70">({restaurant.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <FaClock />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <FaMotorcycle />
                <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt className="text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium text-dark-900">{restaurant.address || '123 Food Street, NY'}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center">
              <FaClock className="text-secondary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Opening Hours</p>
              <p className="text-sm font-medium text-dark-900">10:00 AM - 11:00 PM</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaPhone className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-sm font-medium text-dark-900">{restaurant.phone || '+1 (555) 123-4567'}</p>
            </div>
          </div>
        </div>

        {/* Menu Tabs & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
            {foodCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm capitalize whitespace-nowrap transition-all duration-300 ${
                  activeTab === cat
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            {/* Veg / Non-Veg Toggle */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <span className={`text-sm font-bold ${!showNonVeg ? 'text-green-600' : 'text-gray-400'}`}>Veg</span>
              <button
                onClick={() => setShowNonVeg(!showNonVeg)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  showNonVeg ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                    showNonVeg ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-bold ${showNonVeg ? 'text-red-500' : 'text-gray-400'}`}>Non-Veg</span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-medium text-dark-900 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No items found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}