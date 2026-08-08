import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaStar, FaMotorcycle, FaDice, FaSync } from 'react-icons/fa'
import HeroSection from '../components/HeroSection.jsx'
import Categories from '../components/Categories.jsx'
import OfferBanner from '../components/OfferBanner.jsx'
import Testimonials from '../components/Testimonials.jsx'
import FoodCard from '../components/FoodCard.jsx'
import AISearchBar from '../components/AISearchBar.jsx'
import MoodPicker from '../components/MoodPicker.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useOrders } from '../contexts/OrdersContext.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { useCatalog } from '../contexts/CatalogContext.jsx'

export default function Home() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { orders } = useOrders()
  const { addToCart } = useCart()
  const { foods, restaurants, offers } = useCatalog()
  const [selectedMood, setSelectedMood] = useState(null)

  // Top rated foods
  const topFoods = [...foods].sort((a, b) => b.rating - a.rating).slice(0, 4)
  
  // Mood filtered foods
  const moodFoods = selectedMood 
    ? foods.filter(f => selectedMood.foodCategories.includes(f.category)).slice(0, 4)
    : []

  // User's recent orders (unique foods)
  const userOrders = isAuthenticated ? orders.filter(o => o.customerId === user?.id) : []
  const recentFoodIds = [...new Set(userOrders.flatMap(o => o.items.map(i => i.id.split('-')[0])))]
  const recentFoods = recentFoodIds.map(id => foods.find(f => f.id === id)).filter(Boolean).slice(0, 3)

  // Smart Recommendations (based on history or top rated)
  const recommendedFoods = recentFoodIds.length > 0
    ? foods.filter(f => f.restaurantId === userOrders[0].restaurantId && !recentFoodIds.includes(f.id)).slice(0, 4)
    : topFoods

  // If recommendations are empty fallback to top
  const finalRecs = recommendedFoods.length > 0 ? recommendedFoods : topFoods

  const handleSurprise = () => {
    if (!foods || foods.length === 0) {
      alert("No food items available yet!")
      return
    }
    const randomFood = foods[Math.floor(Math.random() * foods.length)]
    navigate(`/food/${randomFood.id}`)
  }

  return (
    <div className="page-container">
      <HeroSection />

      {/* AI Search Section */}
      <section className="py-8 bg-white dark:bg-dark-950 -mt-6 relative z-10 rounded-t-3xl">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-dark-900 dark:text-white mb-4">What are you craving? ✨</h2>
          <AISearchBar />
        </div>
      </section>

      {/* Recently Ordered (If authenticated and has orders) */}
      {recentFoods.length > 0 && (
        <section className="py-8 bg-gray-50 dark:bg-dark-900 border-t border-b border-gray-100 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-xl flex items-center justify-center">
                <FaSync className="text-sm" />
              </div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">Order Again</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentFoods.map(food => (
                <div key={food.id} className="flex items-center gap-4 bg-white dark:bg-dark-800 p-3 rounded-2xl border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
                  <img src={food.image} alt={food.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-dark-900 dark:text-white truncate">{food.name}</p>
                    <p className="text-xs text-primary-500 font-bold">₹{food.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => addToCart(food)} className="shrink-0 w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                    <FaSync className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Categories activeCategory="all" onCategoryChange={(id) => navigate(`/restaurants?category=${id}`)} />
      
      {offers && offers.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OfferBanner offer={offers[0]} />
        </div>
      )}

      <MoodPicker onSelect={setSelectedMood} />

      {/* Mood Results */}
      {selectedMood && moodFoods.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black text-dark-900 dark:text-white flex items-center gap-2">
                  <span className="text-3xl">{selectedMood.emoji}</span> {selectedMood.label}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Perfect for your current mood</p>
              </div>
              <button onClick={() => setSelectedMood(null)} className="text-sm font-semibold text-gray-500 hover:text-dark-900 dark:hover:text-white transition-colors">Clear</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moodFoods.map(food => <FoodCard key={food.id} food={food} />)}
            </div>
          </div>
        </section>
      )}

      {/* Smart Recommendations */}
      <section className="py-12 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-dark-900 dark:text-white">✨ Recommended for You</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Based on your taste</p>
            </div>
          </div>
          {finalRecs.length > 0 ? (
            <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
              {finalRecs.map(food => (
                <div key={food.id} className="min-w-[260px] sm:min-w-0">
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700">
              <p className="text-gray-500 dark:text-gray-400">No recommended items available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black text-dark-900 dark:text-white">Popular Restaurants</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">The best spots in your area</p>
            </div>
            {restaurants.length > 0 && (
              <Link to="/restaurants" className="hidden sm:flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors group">
                View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.slice(0, 3).map((restaurant) => (
                <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`} className="card group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-dark-900 shadow-lg flex items-center gap-1">
                      <FaStar className="text-yellow-400" /> {restaurant.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{restaurant.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-700 px-3 py-1.5 rounded-lg"><FaMotorcycle className="text-primary-500" /> {restaurant.deliveryTime}</span>
                      <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-dark-700 px-3 py-1.5 rounded-lg text-primary-500 font-semibold">Free Delivery</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-3xl border border-gray-100 dark:border-dark-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No restaurants available.</p>
              <Link to="/owner-dashboard" className="btn-primary">
                Add Your Restaurant
              </Link>
            </div>
          )}
          
          {restaurants.length > 0 && (
            <Link to="/restaurants" className="sm:hidden mt-6 btn-outline w-full justify-center">
              View All Restaurants
            </Link>
          )}
        </div>
      </section>

      <Testimonials />

      {/* Surprise Me FAB */}
      <button 
        onClick={handleSurprise}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-400 to-primary-500 text-white p-4 rounded-full shadow-lg shadow-orange-500/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group overflow-hidden"
      >
        <FaDice className="text-xl group-hover:animate-spin" />
        <span className="font-bold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Surprise Me!</span>
      </button>
    </div>
  )
}
