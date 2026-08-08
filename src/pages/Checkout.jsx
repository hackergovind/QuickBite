import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaLock, FaCheckCircle } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { useOrders } from '../contexts/OrdersContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useWallet } from '../contexts/WalletContext.jsx'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, totalAmount, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { user } = useAuth()
  const { balance } = useWallet()

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [address, setAddress] = useState('123 Main St, Apt 4B')
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Totals calculation
  const subtotal = totalAmount
  const deliveryFee = subtotal > 0 ? 2.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  if (cartItems.length === 0 && !success) {
    return <Navigate to="/cart" />
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    
    // Simulate API call and payment processing
    setTimeout(() => {
      const newOrder = {
        id: `ord_${Math.random().toString(36).substr(2, 9)}`,
        customerId: user?.id,
        items: [...cartItems],
        total,
        subtotal,
        tax,
        deliveryFee,
        status: 'pending',
        date: new Date().toISOString(),
        paymentMethod,
        address
      }
      
      addOrder(newOrder)
      setOrderId(newOrder.id)
      clearCart()
      setIsProcessing(false)
      setSuccess(true)
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex flex-col items-center justify-center py-12 px-4 animate-fade-in transition-colors">
        <div className="bg-white dark:bg-dark-900 p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100 dark:border-dark-800">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Your order #{orderId?.slice(0,8).toUpperCase()} has been placed successfully and is being sent to the restaurant.</p>
          
          <div className="space-y-3">
            <button onClick={() => navigate(`/order/${orderId}`)} className="btn-primary w-full justify-center py-3.5 shadow-lg shadow-primary-500/20">
              Track Order
            </button>
            <button onClick={() => navigate('/')} className="w-full py-3.5 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-xl transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-dark-800 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors border border-gray-100 dark:border-dark-700">
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Checkout Form */}
          <div className="flex-1 space-y-6">
            
            {/* Delivery Address */}
            <div className="section-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-dark-900 dark:text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary-500" /> Delivery Address
                </h2>
                <button className="text-sm font-semibold text-primary-500 hover:underline">Change</button>
              </div>
              <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-xl border border-gray-200 dark:border-dark-700">
                <p className="font-semibold text-dark-900 dark:text-white">{user?.name || 'Customer'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Leave at door</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="section-card">
              <h2 className="font-bold text-lg text-dark-900 dark:text-white mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                {/* Credit Card */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-500'}`}>
                      <FaCreditCard />
                    </div>
                    <div>
                      <p className={`font-semibold ${paymentMethod === 'card' ? 'text-primary-700 dark:text-primary-400' : 'text-dark-900 dark:text-white'}`}>Credit / Debit Card</p>
                      <p className="text-xs text-gray-500">Visa ending in 4242</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                  </div>
                </label>

                {/* Wallet */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'wallet' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-500'}`}>
                      <span className="text-xl">💰</span>
                    </div>
                    <div>
                      <p className={`font-semibold ${paymentMethod === 'wallet' ? 'text-primary-700 dark:text-primary-400' : 'text-dark-900 dark:text-white'}`}>QuickBite Wallet</p>
                      <p className="text-xs text-gray-500">Available: ${balance.toFixed(2)}</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" className="hidden" disabled={balance < total} checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-primary-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-500'}`}>
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <p className={`font-semibold ${paymentMethod === 'cash' ? 'text-primary-700 dark:text-primary-400' : 'text-dark-900 dark:text-white'}`}>Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-primary-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="section-card sticky top-24 space-y-6">
              <h2 className="font-bold text-lg text-dark-900 dark:text-white mb-4">Order Items</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto hide-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <span className="font-bold text-primary-500 w-6">{item.quantity}x</span>
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 dark:text-white line-clamp-1">{item.displayName || item.name}</p>
                    </div>
                    <span className="font-bold text-dark-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-dark-700 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-dark-900 dark:text-white">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span className="font-medium text-dark-900 dark:text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-dark-700 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-base font-bold text-dark-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-primary-500">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing}
                className="btn-primary w-full justify-center py-4 text-lg relative overflow-hidden group shadow-lg shadow-primary-500/20"
              >
                <div className={`absolute inset-0 bg-white/20 -translate-x-full ${isProcessing ? 'animate-[shimmer_1.5s_infinite]' : 'group-hover:translate-x-full transition-transform duration-700 ease-in-out'}`} />
                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
              
              <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                <FaLock /> Secure Checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}