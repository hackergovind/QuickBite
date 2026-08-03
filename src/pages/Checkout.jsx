import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCreditCard, FaMapMarkerAlt, FaCheckCircle, FaLock } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const deliveryFee = 2.99
  const tax = totalAmount * 0.08
  const finalTotal = totalAmount + deliveryFee + tax

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    clearCart()
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
        <div className="text-center px-4 max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-dark-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-8">Your delicious food is being prepared and will be delivered soon.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-primary-500" />
                </div>
                <h2 className="text-lg font-bold text-dark-900">Delivery Address</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="font-medium text-dark-900">{user?.name}</p>
                <p className="text-gray-600 text-sm mt-1">{user?.address || '123 Main Street, New York, NY 10001'}</p>
                <p className="text-gray-600 text-sm">{user?.phone || '+1 (555) 123-4567'}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center">
                  <FaCreditCard className="text-secondary-500" />
                </div>
                <h2 className="text-lg font-bold text-dark-900">Payment Method</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <div className="relative">
                      <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input-field pl-10"
                        defaultValue="4242 4242 4242 4242"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input-field"
                      defaultValue="12/26"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="input-field"
                      defaultValue="123"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                  <FaLock className="text-green-500" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-dark-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-dark-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-dark-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-xl text-primary-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}