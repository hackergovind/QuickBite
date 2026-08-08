import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaPlus, FaMinus, FaLeaf, FaFire, FaHeart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { useFavorites } from '../contexts/FavoritesContext.jsx'
import FoodCustomizer from './FoodCustomizer.jsx'

const AVAILABILITY_BADGE = {
  sold_out: { label: 'Sold Out', cls: 'bg-red-500 text-white' },
  limited: { label: null, cls: '' }, // shown differently
}

export default function FoodCard({ food, showAddButton = true }) {
  const { cartItems, addToCart, updateQuantity } = useCart()
  const { isFavoriteFood, toggleFavoriteFood } = useFavorites()
  const [isHovered, setIsHovered] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)

  const cartItem = cartItems.find(item => item.id === food.id || item.id?.startsWith(food.id + '-'))
  const quantity = cartItem?.quantity || 0
  const isFav = isFavoriteFood(food.id)
  const isSoldOut = food.availability === 'sold_out'
  const isLimited = food.availability === 'limited'

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSoldOut) return
    if (food.customizable) {
      setShowCustomizer(true)
    } else {
      addToCart(food)
    }
  }

  const handleUpdate = (e, newQty) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(food.id, newQty)
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavoriteFood(food.id)
  }

  return (
    <>
      <div
        className="card group dark:bg-dark-800 dark:border-dark-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/food/${food.id}`}>
          <div className="relative overflow-hidden aspect-square">
            {food.image ? (
              <img
                src={food.image}
                alt={food.name}
                className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${isSoldOut ? 'grayscale' : ''}`}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
                <span className="text-5xl">🍽️</span>
              </div>
            )}

            {/* Sold Out overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm">Sold Out</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {food.isVeg && (
                <span className="bg-green-500 text-white p-1.5 rounded-lg shadow-lg">
                  <FaLeaf className="text-xs" />
                </span>
              )}
              {food.tags?.includes('Bestseller') && !isSoldOut && (
                <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                  <FaFire /> Hot
                </span>
              )}
              {isLimited && !isSoldOut && food.stockLeft && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                  Only {food.stockLeft} left!
                </span>
              )}
            </div>

            {/* Favorite heart */}
            <button
              onClick={handleFavorite}
              className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${isFav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
            >
              <FaHeart className="text-sm" />
            </button>

            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered && !isSoldOut ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <Link to={`/food/${food.id}`}>
            <h3 className="font-bold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
              {food.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {food.rating > 0 ? food.rating : 'New'}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{food.calories} cal</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-dark-900 dark:text-white">₹{food.price.toFixed(2)}</span>

            {showAddButton && !isSoldOut && (
              <div className="flex items-center">
                {quantity === 0 ? (
                  <button
                    onClick={handleAdd}
                    className="bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-500 text-primary-600 dark:text-primary-400 hover:text-white border border-primary-200 dark:border-primary-800 hover:border-primary-500 rounded-xl px-4 py-2 font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add
                    {food.customizable && <span className="text-xs opacity-70">⚙️</span>}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl px-3 py-2 border border-primary-200 dark:border-primary-800">
                    <button
                      onClick={(e) => handleUpdate(e, quantity - 1)}
                      className="w-6 h-6 bg-white dark:bg-dark-700 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="font-bold text-primary-700 dark:text-primary-400 w-4 text-center">{quantity}</span>
                    <button
                      onClick={(e) => handleUpdate(e, quantity + 1)}
                      className="w-6 h-6 bg-white dark:bg-dark-700 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {isSoldOut && (
              <span className="text-xs text-red-500 font-semibold">Unavailable</span>
            )}
          </div>
        </div>
      </div>

      {showCustomizer && (
        <FoodCustomizer food={food} onConfirm={addToCart} onClose={() => setShowCustomizer(false)} />
      )}
    </>
  )
}