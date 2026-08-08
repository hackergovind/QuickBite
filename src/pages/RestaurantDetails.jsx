import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaStar, FaClock, FaMotorcycle, FaArrowLeft, FaMapMarkerAlt, FaPhone, FaHeart, FaShare } from 'react-icons/fa'
import { restaurants, foods } from '../data/dummyData.js'
import FoodCard from '../components/FoodCard.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useFavorites } from '../contexts/FavoritesContext.jsx'
import { useReviews } from '../contexts/ReviewsContext.jsx'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'

export default function RestaurantDetails() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { isFavoriteRestaurant, toggleFavoriteRestaurant } = useFavorites()
  const { getReviewsByRestaurant } = useReviews()
  const { ownerRestaurants } = useRestaurantOwner()

  const [activeTab, setActiveTab] = useState('menu')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isVegOnly, setIsVegOnly] = useState(false)

  // Merge dummy restaurants and owner restaurants
  const allRestaurants = [...restaurants, ...ownerRestaurants]
  const restaurant = allRestaurants.find(r => r.id === id)

  if (!restaurant) {
    return (
      <div className="page-container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    )
  }

  const reviews = getReviewsByRestaurant(id)
  const isFav = isFavoriteRestaurant(id)
  
  // Menu logic
  const menu = restaurant.dishes || []
  const categories = ['all', ...new Set(menu.map(f => f.category || 'other'))]

  let filteredMenu = menu
  if (selectedCategory !== 'all') filteredMenu = filteredMenu.filter(f => f.category === selectedCategory)
  if (isVegOnly) filteredMenu = filteredMenu.filter(f => f.isVeg)

  return (
    <div className="page-container pb-12">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/40 to-transparent" />
        
        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Link to="/restaurants" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <FaArrowLeft />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <FaShare />
            </button>
            <button 
              onClick={() => toggleFavoriteRestaurant(id)} 
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors shadow-lg ${isFav ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
            >
              <FaHeart />
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white max-w-7xl mx-auto">
          {!restaurant.isOpen && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
              Currently Closed
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-black mb-2">{restaurant.name}</h1>
          <p className="text-gray-200 text-sm md:text-base mb-4">{restaurant.cuisine} • {restaurant.tags?.join(' • ') || 'Premium Quality'}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <FaStar className="text-yellow-400" />
              <span>{restaurant.rating} ({restaurant.reviews || reviews.length}+ ratings)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <FaClock />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <FaMapMarkerAlt />
              <span>2.4 km away</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 dark:border-dark-700 mb-8 sticky top-16 bg-gray-50/90 dark:bg-dark-950/90 backdrop-blur z-30 pt-4">
          {['menu', 'reviews', 'gallery'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-6 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-primary-500' : 'text-gray-500 hover:text-dark-900 dark:hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t-lg" />}
            </button>
          ))}
        </div>

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full sm:w-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-colors border ${
                      selectedCategory === cat
                        ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900 border-transparent'
                        : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-700 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Veg Only</span>
                <button
                  onClick={() => setIsVegOnly(!isVegOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isVegOnly ? 'bg-green-500' : 'bg-gray-300 dark:bg-dark-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isVegOnly ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenu.map(food => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
            {filteredMenu.length === 0 && (
              <p className="text-center text-gray-500 py-12">No items found matching these filters.</p>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
            <div className="section-card flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <p className="text-6xl font-black text-dark-900 dark:text-white">{restaurant.rating}</p>
                <div className="flex items-center justify-center gap-1 my-2">
                  {[1,2,3,4,5].map(i => <FaStar key={i} className={i <= restaurant.rating ? 'text-yellow-400 text-lg' : 'text-gray-200 dark:text-dark-700 text-lg'} />)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 w-full space-y-2">
                {[5,4,3,2,1].map(stars => {
                  const count = reviews.filter(r => Math.round(r.rating) === stars).length
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={stars} className="flex items-center gap-3 text-sm font-medium">
                      <span className="w-4">{stars}</span>
                      <FaStar className="text-yellow-400 text-xs shrink-0" />
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-gray-500">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-dark-900 dark:text-white border-b border-gray-100 dark:border-dark-700 pb-2">User Reviews</h3>
              {reviews.map(r => (
                <ReviewCard key={r.id} review={r} />
              ))}
              {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-dark-700">
              {isAuthenticated ? (
                <ReviewForm restaurantId={id} />
              ) : (
                <div className="bg-gray-50 dark:bg-dark-800 p-6 rounded-2xl text-center border border-gray-100 dark:border-dark-700">
                  <p className="font-semibold text-dark-900 dark:text-white mb-3">Want to leave a review?</p>
                  <Link to="/login" className="btn-primary">Log In to Review</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in">
            {restaurant.gallery?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {restaurant.gallery.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer group">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-3xl border border-gray-100 dark:border-dark-700">
                <span className="text-4xl">📸</span>
                <h3 className="font-bold text-dark-900 dark:text-white mt-4">No photos yet</h3>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}