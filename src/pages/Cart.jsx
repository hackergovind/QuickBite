import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { restaurants } from '../data/dummyData.js'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()

  const deliveryFee = cartItems.length > 0 ? 2.99 : 0
  const tax = totalAmount * 0.08
  const finalTotal = totalAmount + deliveryFee + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingBag className="text-4xl text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
          <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2">
            Browse Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">Your Cart</h1>
            <p className="text-gray-500 text-sm">{cartItems.length} items from {new Set(cartItems.map(i => i.restaurantId)).size} restaurant(s)</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const restaurant = restaurants.find(r => r.id === item.restaurantId)
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex gap-4 animate-slide-up">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-dark-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">{restaurant?.name}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-primary-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="font-bold text-dark-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-primary-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-dark-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            <button
              onClick={clearCart}
              className="text-red-500 text-sm font-medium hover:underline flex items-center gap-2"
            >
              <FaTrash /> Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-dark-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark-900">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-dark-900">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-dark-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="font-bold text-dark-900">Total</span>
                  <span className="font-bold text-2xl text-primary-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-dark-900">Deliver to</p>
                  <p className="text-gray-500 truncate">123 Main Street, New York, NY</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full justify-center text-lg py-4"
              >
                Proceed to Checkout
              </button>

              <Link to="/restaurants" className="block text-center text-sm text-gray-500 hover:text-primary-500 mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}