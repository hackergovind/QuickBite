import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaLeaf, FaFire, FaArrowLeft, FaPlus, FaMinus, FaShoppingCart, FaHeart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { foods, restaurants } from '../data/dummyData.js'

export default function FoodDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cartItems, addToCart, updateQuantity } = useCart()
  const [isLiked, setIsLiked] = useState(false)

  const food = foods.find(f => f.id === id)
  const restaurant = food ? restaurants.find(r => r.id === food.restaurantId) : null

  const cartItem = cartItems.find(item => item.id === food?.id)
  const quantity = cartItem?.quantity || 0

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Food item not found</h2>
          <Link to="/restaurants" className="text-primary-500 hover:underline">Browse restaurants</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-dark-900 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <FaHeart className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {food.isVeg && (
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1 shadow-lg">
                  <FaLeaf /> Vegetarian
                </span>
              )}
              {food.tags?.map(tag => (
                <span key={tag} className="bg-primary-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <Link
              to={`/restaurant/${restaurant?.id}`}
              className="text-primary-500 font-medium hover:underline mb-2"
            >
              {restaurant?.name}
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">{food.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl">
                <FaStar className="text-yellow-400" />
                <span className="font-bold text-gray-700">{food.rating}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-xl text-sm text-gray-600">
                <FaFire className="text-primary-400" />
                <span>{food.calories} calories</span>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {food.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-3xl font-bold text-dark-900">${food.price.toFixed(2)}</p>
              </div>

              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(food)}
                  className="btn-primary inline-flex items-center gap-2 text-lg px-8"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(food.id, quantity - 1)}
                    className="w-12 h-12 bg-gray-100 hover:bg-primary-500 hover:text-white rounded-xl flex items-center justify-center text-dark-900 transition-all duration-300"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-2xl font-bold text-dark-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(food.id, quantity + 1)}
                    className="w-12 h-12 bg-gray-100 hover:bg-primary-500 hover:text-white rounded-xl flex items-center justify-center text-dark-900 transition-all duration-300"
                  >
                    <FaPlus />
                  </button>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-2xl border border-gray-100">
                <p className="text-2xl mb-1">🍳</p>
                <p className="text-xs text-gray-500">Freshly Made</p>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl border border-gray-100">
                <p className="text-2xl mb-1">🚚</p>
                <p className="text-xs text-gray-500">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl border border-gray-100">
                <p className="text-2xl mb-1">♨️</p>
                <p className="text-xs text-gray-500">Stay Hot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}