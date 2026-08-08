import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaPhone, FaCommentDots, FaArrowLeft, FaMotorcycle, FaStar } from 'react-icons/fa'
import { useOrders } from '../contexts/OrdersContext.jsx'
import OrderTracker from '../components/OrderTracker.jsx'
import { useCatalog } from '../contexts/CatalogContext.jsx'

const FALLBACK_PARTNER = {
  name: 'QuickBite Rider',
  vehicle: 'Bike',
  phone: '',
  rating: 4.8,
  deliveries: 500,
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop'
}

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, updateOrderStatus } = useOrders()
  const { deliveryPartners } = useCatalog()
  
  const order = orders.find(o => o.id === id)
  const [localStatus, setLocalStatus] = useState(order?.status || 'pending')
  const [eta, setEta] = useState(35)
  const partner = deliveryPartners[0] || FALLBACK_PARTNER

  // Auto-progression for demo purposes
  useEffect(() => {
    if (!order) return
    
    // Only auto-progress if starting from pending or confirmed (for demo)
    if (order.status === 'pending') {
      const timers = [
        setTimeout(() => { setLocalStatus('confirmed'); updateOrderStatus(order.id, 'confirmed') }, 3000),
        setTimeout(() => { setLocalStatus('preparing'); updateOrderStatus(order.id, 'preparing') }, 6000),
        setTimeout(() => { setLocalStatus('out_for_delivery'); updateOrderStatus(order.id, 'out_for_delivery') }, 12000),
        setTimeout(() => { setLocalStatus('delivered'); updateOrderStatus(order.id, 'delivered'); setEta(0) }, 20000),
      ]
      return () => timers.forEach(clearTimeout)
    }
  }, [order?.id])

  // Countdown ETA
  useEffect(() => {
    if (localStatus === 'delivered' || localStatus === 'cancelled') return
    const timer = setInterval(() => {
      setEta(prev => Math.max(1, prev - 1))
    }, 60000)
    return () => clearInterval(timer)
  }, [localStatus])

  if (!order) {
    return (
      <div className="page-container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
      </div>
    )
  }

  return (
    <div className="page-container py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-dark-800 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Track Order</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id.slice(0,8).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tracking Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Animated Map Placeholder */}
            <div className="section-card overflow-hidden p-0 relative h-64 bg-gray-100 dark:bg-dark-800">
              <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Estimated Time</p>
                  <p className="text-2xl font-black text-primary-500">{eta} <span className="text-sm font-medium">min</span></p>
                </div>
              </div>

              {/* Delivery Path */}
              <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-gray-300 dark:bg-dark-600 rounded-full overflow-hidden -translate-y-1/2">
                <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: localStatus === 'delivered' ? '100%' : localStatus === 'out_for_delivery' ? '70%' : localStatus === 'preparing' ? '30%' : '10%' }} />
              </div>
              
              {/* Markers */}
              <div className="absolute top-1/2 left-8 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-dark-800 -translate-y-1/2 shadow-lg z-10" />
              <div className="absolute top-1/2 right-8 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-dark-800 -translate-y-1/2 shadow-lg z-10" />
              
              {/* Moving Scooter */}
              {(localStatus === 'out_for_delivery' || localStatus === 'preparing') && (
                <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 z-20 shadow-xl bg-white dark:bg-dark-800 rounded-full p-2 animate-bounce-slow"
                     style={{ left: localStatus === 'out_for_delivery' ? '65%' : '25%' }}>
                  <span className="text-2xl">🛵</span>
                </div>
              )}
            </div>

            {/* Tracker Stepper */}
            <div className="section-card">
              <OrderTracker status={localStatus} />
            </div>

            {/* Delivery Partner */}
            {(localStatus === 'out_for_delivery' || localStatus === 'delivered') && (
              <div className="section-card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={partner.photo} alt={partner.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-500" />
                    <span className="absolute -bottom-1 -right-1 bg-white dark:bg-dark-800 rounded-full p-0.5 shadow-sm">
                      <FaMotorcycle className="text-primary-500 text-xs" />
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-dark-900 dark:text-white">{partner.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{partner.vehicle}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs font-semibold text-dark-900 dark:text-white">{partner.rating}</span>
                      <span className="text-xs text-gray-400">({partner.deliveries} deliveries)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a href={`tel:${partner.phone}`} className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                    <FaPhone />
                  </a>
                  <button onClick={() => alert('Chat feature coming soon!')} className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                    <FaCommentDots />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="section-card">
              <h3 className="font-bold text-dark-900 dark:text-white mb-4 border-b border-gray-100 dark:border-dark-700 pb-3">Order Details</h3>
              
              <div className="space-y-3 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div className="flex gap-2">
                      <span className="font-semibold text-primary-500">{item.quantity}x</span>
                      <div>
                        <p className="font-medium text-dark-900 dark:text-white">{item.displayName || item.name}</p>
                        {item.customizations && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customized</p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-dark-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 dark:border-dark-700 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                </div>
                {order.deliveryFee && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery</span>
                    <span>₹{order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {order.tax && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-dark-900 dark:text-white pt-2 border-t border-gray-100 dark:border-dark-700 mt-2">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/')} className="flex-1 py-3 bg-gray-100 dark:bg-dark-800 text-dark-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
