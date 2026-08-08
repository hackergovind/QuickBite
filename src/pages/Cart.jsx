import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaShoppingBag } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import CouponInput from '../components/CouponInput.jsx'
import TipSelector from '../components/TipSelector.jsx'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart()
  const [tip, setTip] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  // Calculate totals
  const subtotal = totalAmount
  const deliveryFee = subtotal > 0 ? 2.99 : 0
  const tax = subtotal * 0.08
  
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = subtotal * (appliedCoupon.discount / 100)
    } else if (appliedCoupon.type === 'flat') {
      discount = appliedCoupon.discount
    } else if (appliedCoupon.type === 'delivery') {
      discount = deliveryFee
    }
  }

  const finalTotal = subtotal + deliveryFee + tax + tip - discount

  if (cartItems.length === 0) {
    return (
      <div className="page-container py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-32 h-32 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingBag className="text-4xl text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/restaurants" className="btn-primary inline-flex">
            Browse Restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            <div className="section-card divide-y divide-gray-100 dark:divide-dark-700">
              {cartItems.map(item => (
                <div key={item.id} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 bg-gray-100 dark:bg-dark-800" />
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-dark-900 dark:text-white text-base sm:text-lg line-clamp-2">{item.displayName || item.name}</h3>
                      <p className="font-bold text-primary-500 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{item.restaurantName || 'Restaurant'}</p>
                    
                    {/* Customizations display if any */}
                    {item.customizations && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.customizations.extraCheese && <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-md">+ Cheese</span>}
                        {item.customizations.removeOnion && <span className="text-xs bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">No Onion</span>}
                        {item.customizations.spicyLevel && item.customizations.spicyLevel !== 'mild' && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-md capitalize">{item.customizations.spicyLevel} Spice</span>}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-dark-700 rounded-xl px-3 py-1.5 border border-gray-200 dark:border-dark-600">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 p-1">
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="font-bold text-dark-900 dark:text-white w-4 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 p-1">
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-colors">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-card">
              <TipSelector tip={tip} onChange={setTip} />
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="section-card sticky top-24 space-y-6">
              <h2 className="font-bold text-lg text-dark-900 dark:text-white border-b border-gray-100 dark:border-dark-700 pb-4">Order Summary</h2>
              
              <CouponInput totalAmount={subtotal} onApply={setAppliedCoupon} appliedCoupon={appliedCoupon} />

              <div className="space-y-3 text-sm border-t border-gray-100 dark:border-dark-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-dark-900 dark:text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-dark-900 dark:text-white">₹{tax.toFixed(2)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Courier Tip</span>
                    <span className="font-medium text-dark-900 dark:text-white">₹{tip.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-100 dark:border-dark-700 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-base font-bold text-dark-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-primary-500">₹{Math.max(0, finalTotal).toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full justify-between py-4 group">
                <span>Proceed to Checkout</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}