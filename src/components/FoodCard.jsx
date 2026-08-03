import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaPlus, FaMinus, FaLeaf, FaFire } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'

export default function FoodCard({ food, showAddButton = true }) {
  const { cartItems, addToCart, updateQuantity } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const cartItem = cartItems.find(item => item.id === food.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(food)
  }

  const handleUpdate = (e, newQty) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(food.id, newQty)
  }

  return (
    <div
      className="card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/food/${food.id}`}>
        <div className="relative overflow-hidden aspect-square">
          {food.image ? (
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {food.isVeg && (
              <span className="bg-green-500 text-white p-1.5 rounded-lg shadow-lg">
                <FaLeaf className="text-xs" />
              </span>
            )}
            {food.tags?.includes('Bestseller') && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                <FaFire /> Hot
              </span>
            )}
          </div>
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <Link to={`/food/${food.id}`}>
          <h3 className="font-bold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {food.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-medium text-gray-700">
              {food.rating > 0 ? food.rating : 'New'}
            </span>
          </div>
          <span className="text-sm text-gray-500">{food.calories} cal</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-dark-900">${food.price.toFixed(2)}</span>

          {showAddButton && (
            <div className="flex items-center">
              {quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  className="bg-primary-50 hover:bg-primary-500 text-primary-600 hover:text-white border border-primary-200 hover:border-primary-500 rounded-xl px-4 py-2 font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <FaPlus className="text-xs" /> Add
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-primary-50 rounded-xl px-3 py-2 border border-primary-200">
                  <button
                    onClick={(e) => handleUpdate(e, quantity - 1)}
                    className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-primary-600 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="font-bold text-primary-700 w-4 text-center">{quantity}</span>
                  <button
                    onClick={(e) => handleUpdate(e, quantity + 1)}
                    className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-primary-600 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}