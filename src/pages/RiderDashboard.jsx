import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaMotorcycle, FaStar, FaMapMarkerAlt, FaCheck, FaTimes, FaPhone, FaLocationArrow, FaList, FaChartBar, FaHistory, FaUser } from 'react-icons/fa'
import { BarChart, StatCard } from '../components/AnalyticsChart.jsx'

const MOCK_PENDING = [
  { id: 'd1', restaurantName: 'Burger Kingpin', restaurantAddress: '15 Food Street', customerName: 'Rahul M.', customerAddress: '42 Park Avenue', items: 'Classic Cheeseburger x2', total: 24.50, distance: '1.2 km', eta: '15 min' },
  { id: 'd2', restaurantName: 'Pizza Palace', restaurantAddress: '88 Main Road', customerName: 'Priya S.', customerAddress: '7 Lake View', items: 'Margherita Pizza x1', total: 14.99, distance: '0.8 km', eta: '10 min' },
  { id: 'd3', restaurantName: 'Spice Route', restaurantAddress: '23 Curry Lane', customerName: 'Amit K.', customerAddress: '99 Sunset Blvd', items: 'Butter Chicken x1, Naan x2', total: 18.49, distance: '2.1 km', eta: '22 min' },
]

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [pending, setPending] = useState(MOCK_PENDING)
  const [activeDelivery, setActiveDelivery] = useState(null)

  const handleAccept = (id) => {
    const delivery = pending.find(d => d.id === id)
    setActiveDelivery(delivery)
    setPending(pending.filter(d => d.id !== id))
    setActiveTab('active')
  }

  const handleReject = (id) => {
    setPending(pending.filter(d => d.id !== id))
  }

  const completeDelivery = () => {
    alert('Delivery completed successfully! Earning added.')
    setActiveDelivery(null)
    setActiveTab('dashboard')
  }

  const navItems = [
    { id: 'dashboard', icon: <FaList />, label: 'Dashboard' },
    { id: 'active', icon: <FaMotorcycle />, label: 'Active Delivery' },
    { id: 'earnings', icon: <FaChartBar />, label: 'Earnings' },
    { id: 'history', icon: <FaHistory />, label: 'History' },
    { id: 'profile', icon: <FaUser />, label: 'Profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex flex-col md:flex-row transition-colors">
      
      {/* Mobile Header / Desktop Sidebar */}
      <div className="bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 w-full md:w-64 shrink-0 flex flex-col sticky top-0 md:h-screen z-20">
        <div className="p-6 flex items-center justify-between md:block border-b border-gray-100 dark:border-dark-800 md:border-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-dark-900 dark:text-white">Rider App</span>
          </Link>
          
          {/* Online Toggle Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-dark-600'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${isOnline ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Online Toggle Desktop */}
        <div className="hidden md:flex p-6 pt-0 flex-col gap-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
            <span className="font-semibold text-sm text-dark-900 dark:text-white">{isOnline ? 'You are Online' : 'You are Offline'}</span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-dark-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}
            >
              <span className={activeTab === item.id ? 'text-primary-500' : 'opacity-70'}>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
              {item.id === 'active' && activeDelivery && <span className="w-2 h-2 bg-primary-500 rounded-full ml-auto md:block hidden" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto w-full">
        
        {!isOnline && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-2xl flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">😴</span>
              <div>
                <p className="font-bold">You are currently offline</p>
                <p className="text-sm opacity-80">Go online to start receiving delivery requests.</p>
              </div>
            </div>
            <button onClick={() => setIsOnline(true)} className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl text-sm">Go Online</button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Today's Earnings" value="$42.50" icon="💰" color="green" trend={12} />
              <StatCard label="Deliveries Today" value="7" icon={<FaMotorcycle />} color="primary" />
              <StatCard label="Current Rating" value="4.8" icon={<FaStar className="text-yellow-400"/>} color="primary" />
              <StatCard label="Acceptance Rate" value="94%" icon="✅" color="blue" />
            </div>

            {isOnline && (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-dark-800 pb-2">
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-ping-slow" /> Pending Requests
                  </h2>
                  <span className="bg-gray-100 dark:bg-dark-800 px-3 py-1 rounded-full text-xs font-bold text-gray-500">{pending.length} new</span>
                </div>

                {pending.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-dark-900 rounded-3xl border border-gray-100 dark:border-dark-800">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaLocationArrow className="text-3xl text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="font-bold text-dark-900 dark:text-white">Looking for orders...</p>
                    <p className="text-sm text-gray-500 mt-1">Make sure you are in a busy area.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {pending.map(req => (
                      <div key={req.id} className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-primary-100 dark:border-primary-900/30 shadow-md shadow-primary-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                          {req.eta}
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="space-y-3 flex-1">
                            {/* Pick up */}
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center mt-1">
                                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                <div className="w-0.5 h-8 bg-gray-200 dark:bg-dark-700" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-dark-900 dark:text-white">Pick up: {req.restaurantName}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{req.restaurantAddress}</p>
                              </div>
                            </div>
                            {/* Drop off */}
                            <div className="flex gap-3">
                              <div className="flex flex-col items-center mt-1">
                                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-900" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-dark-900 dark:text-white">Drop off: {req.customerName}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{req.customerAddress}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0 ml-4">
                            <p className="text-xl font-black text-green-600 dark:text-green-500">${(req.total * 0.2 + 2).toFixed(2)}</p>
                            <p className="text-xs font-medium text-gray-400">Est. Earning</p>
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-dark-800 px-2 py-1 rounded-lg inline-block">{req.distance}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-3 mb-4 text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-dark-700">
                          <span className="font-semibold text-gray-400">Items:</span> {req.items}
                        </div>

                        <div className="flex gap-3">
                          <button onClick={() => handleReject(req.id)} className="flex-1 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                            <FaTimes /> Reject
                          </button>
                          <button onClick={() => handleAccept(req.id)} className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20 text-sm flex items-center justify-center gap-2">
                            <FaCheck /> Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Active Delivery</h2>
            
            {!activeDelivery ? (
              <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-3xl border border-gray-100 dark:border-dark-800">
                <span className="text-4xl block mb-4">🙌</span>
                <p className="font-bold text-dark-900 dark:text-white">No active delivery.</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-4 text-primary-500 font-medium hover:underline">Go find one</button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Map Placeholder */}
                <div className="relative h-64 bg-gray-100 dark:bg-dark-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-dark-700">
                  <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  
                  <div className="absolute top-1/2 left-10 right-10 h-2 bg-gray-200 dark:bg-dark-700 rounded-full -translate-y-1/2">
                    <div className="h-full bg-primary-500 w-1/2 rounded-full" />
                  </div>
                  
                  <div className="absolute top-1/2 left-[10%] w-6 h-6 bg-blue-500 rounded-full border-4 border-white -translate-y-1/2 shadow-lg" />
                  <div className="absolute top-1/2 right-[10%] w-6 h-6 bg-green-500 rounded-full border-4 border-white -translate-y-1/2 shadow-lg" />
                  
                  <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-dark-800 rounded-full p-2 shadow-xl animate-bounce-slow">
                    <span className="text-2xl">🛵</span>
                  </div>

                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-900/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 font-bold text-dark-900 dark:text-white">
                    {activeDelivery.eta} to dropoff
                  </div>
                  <button onClick={() => alert('Opening Navigation...')} className="absolute top-4 right-4 bg-primary-500 text-white w-10 h-10 rounded-xl shadow-lg flex items-center justify-center hover:bg-primary-600">
                    <FaLocationArrow />
                  </button>
                </div>

                {/* Details */}
                <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 border border-gray-100 dark:border-dark-800 space-y-6 shadow-sm">
                  <div className="flex gap-4 border-b border-gray-100 dark:border-dark-800 pb-6">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center text-xl shrink-0">👤</div>
                    <div className="flex-1">
                      <p className="font-bold text-dark-900 dark:text-white text-lg">{activeDelivery.customerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activeDelivery.customerAddress}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center hover:bg-green-100">
                        <FaPhone />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
                    <p className="text-sm font-medium text-dark-900 dark:text-white">{activeDelivery.items}</p>
                  </div>

                  <button onClick={completeDelivery} className="btn-primary w-full py-4 text-lg shadow-primary-500/30">
                    Mark as Delivered
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Earnings Dashboard</h2>
            <div className="bg-primary-500 rounded-3xl p-6 text-white flex justify-between items-center shadow-lg shadow-primary-500/20">
              <div>
                <p className="text-primary-100 text-sm font-medium mb-1">This Week</p>
                <p className="text-4xl font-black">$487.50</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100 text-sm font-medium mb-1">Total Deliveries</p>
                <p className="text-2xl font-bold">56</p>
              </div>
            </div>

            <BarChart 
              title="Weekly Breakdown" 
              valuePrefix="$"
              color="#F97316"
              data={[
                { label: 'Mon', value: 45 },
                { label: 'Tue', value: 68 },
                { label: 'Wed', value: 32 },
                { label: 'Thu', value: 85 },
                { label: 'Fri', value: 110 },
                { label: 'Sat', value: 147 },
                { label: 'Sun', value: 0 },
              ]}
            />

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5 flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-700 dark:text-amber-500">Weekend Quest</h3>
                <p className="text-sm text-amber-600 dark:text-amber-600/80 mt-0.5">Complete 5 more deliveries to earn a <span className="font-bold">$10 bonus!</span></p>
                <div className="w-full h-2 bg-amber-200 dark:bg-amber-900/40 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-amber-500 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'history' || activeTab === 'profile') && (
          <div className="text-center py-20 animate-fade-in">
            <span className="text-5xl block mb-4">🚧</span>
            <h2 className="text-xl font-bold text-dark-900 dark:text-white">Coming Soon</h2>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        )}

      </div>
    </div>
  )
}
