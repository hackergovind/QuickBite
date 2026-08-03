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
  const { ownerRestaurants } = useRestaurantOwner()

  // Merge static + owner restaurants for lookup
  const allRestaurants = [...restaurants, ...ownerRestaurants]
  const allFoods = [...foods, ...ownerRestaurants.flatMap(r => r.dishes || [])]

  const restaurant = allRestaurants.find(r => r.id === id)
  const restaurantFoods = allFoods.filter(f => f.restaurantId === id)

  const foodCategories = ['all', ...new Set(restaurantFoods.map(f => f.category))]

  const filteredFoods = activeTab === 'all'
    ? restaurantFoods
    : restaurantFoods.filter(f => f.category === activeTab)

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

        {/* Menu Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-2">
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