import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaFire } from 'react-icons/fa'
import HeroSection from '../components/HeroSection.jsx'
import Categories from '../components/Categories.jsx'
import RestaurantCard from '../components/RestaurantCard.jsx'
import FoodCard from '../components/FoodCard.jsx'
import OfferBanner from '../components/OfferBanner.jsx'
import Testimonials from '../components/Testimonials.jsx'
import { restaurants, foods, offers } from '../data/dummyData.js'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredRestaurants = activeCategory === 'all'
    ? restaurants.slice(0, 4)
    : restaurants.filter(r => r.category === activeCategory).slice(0, 4)

  const featuredFoods = foods.slice(0, 4)

  return (
    <div className="animate-fade-in">
      <HeroSection />

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-dark-900 mb-2">Popular Restaurants</h2>
              <p className="text-gray-500">Top-rated places near you</p>
            </div>
            <Link to="/restaurants" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group">
              View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/restaurants" className="btn-outline inline-flex items-center gap-2">
              View All Restaurants <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">Exclusive Offers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map(offer => (
              <OfferBanner key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* City Popular Dishes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <FaFire className="text-primary-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark-900">City Popular Dishes</h2>
              <p className="text-gray-500">Most ordered dishes this week</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  )
}