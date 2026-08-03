import React from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaClock, FaMotorcycle } from 'react-icons/fa'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="group">
      <div className="card h-full transform group-hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {restaurant.badge && (
            <div className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {restaurant.badge}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
              <FaStar className="text-green-600 text-xs" />
              <span className="text-sm font-bold text-green-700">{restaurant.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-1">{restaurant.cuisine}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <FaClock className="text-primary-400" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaMotorcycle className="text-primary-400" />
              <span>{restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}`}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}