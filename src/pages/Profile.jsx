import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaWallet, FaCog, FaSignOutAlt, FaStar, FaEdit } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useOrders } from '../contexts/OrdersContext.jsx'
import { useFavorites } from '../contexts/FavoritesContext.jsx'
import { useWallet } from '../contexts/WalletContext.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import { useCatalog } from '../contexts/CatalogContext.jsx'
import AddressManager from '../components/AddressManager.jsx'
import WalletCard from '../components/WalletCard.jsx'
import DarkModeToggle from '../components/DarkModeToggle.jsx'
import FoodCard from '../components/FoodCard.jsx'
import RestaurantCard from '../components/RestaurantCard.jsx'

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth()
  const { orders } = useOrders()
  const { favFoods, favRestaurants } = useFavorites()
  const { tier, points } = useWallet()
  const { addToCart } = useCart()
  const { foods, restaurants } = useCatalog()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)

  if (!isAuthenticated) return <Navigate to="/login" />

  const userOrders = orders.filter(o => o.customerId === user?.id)
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)

  const favoriteFoods = foods.filter(f => favFoods.includes(f.id))
  const favoriteRestaurants = restaurants.filter(r => favRestaurants.includes(r.id))

  const handleReorder = (order) => {
    order.items.forEach(item => {
      // Create a simplified item matching addToCart signature
      const foodItem = foods.find(f => f.id === item.id.split('-')[0]) || item
      addToCart({ ...foodItem, quantity: item.quantity })
    })
    navigate('/cart')
  }

  const TABS = [
    { id: 'profile', icon: <FaUser />, label: 'Profile Info' },
    { id: 'orders', icon: <FaShoppingBag />, label: 'My Orders' },
    { id: 'favorites', icon: <FaHeart />, label: 'Favorites' },
    { id: 'addresses', icon: <FaMapMarkerAlt />, label: 'Addresses' },
    { id: 'wallet', icon: <FaWallet />, label: 'Wallet' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
  ]

  return (
    <div className="page-container py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {/* User Card */}
            <div className="section-card text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary-500 to-orange-400" />
              <div className="relative mt-8">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dark-800 mx-auto shadow-md" />
                <h2 className="text-xl font-bold text-dark-900 dark:text-white mt-4">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="inline-block mt-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800/50">
                  {tier} Member
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-100 dark:border-dark-700 pt-6">
                <div>
                  <p className="text-2xl font-black text-dark-900 dark:text-white">{userOrders.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-primary-500">{points}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Points</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="section-card p-3">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <div className="my-2 border-t border-gray-100 dark:border-dark-700" />
              <button
                onClick={() => { logout(); navigate('/') }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors"
              >
                <FaSignOutAlt className="opacity-70" />
                Log Out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="section-card min-h-[600px]">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-dark-700 pb-4">
                    <h2 className="text-xl font-bold text-dark-900 dark:text-white">Personal Information</h2>
                    <button onClick={() => setEditing(!editing)} className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1.5">
                      <FaEdit /> {editing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  <div className="space-y-6 max-w-lg">
                    {['Name', 'Email', 'Phone'].map(field => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field}</label>
                        <input
                          type={field === 'Email' ? 'email' : 'text'}
                          defaultValue={user[field.toLowerCase()] || ''}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-50 dark:bg-dark-900 border-transparent text-gray-500' : ''}`}
                        />
                      </div>
                    ))}
                    {editing && (
                      <button className="btn-primary" onClick={() => setEditing(false)}>Save Changes</button>
                    )}
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-700 pb-4">Order History</h2>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-dark-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaShoppingBag className="text-3xl text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="font-semibold text-dark-900 dark:text-white">No orders yet</p>
                      <Link to="/restaurants" className="text-primary-500 text-sm font-medium hover:underline mt-2 inline-block">Order now</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map(order => (
                        <div key={order.id} className="border border-gray-100 dark:border-dark-700 rounded-2xl p-4 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-dark-900 dark:text-white">{order.restaurantName || 'QuickBite Order'}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(order.date).toLocaleDateString()} • {order.items.length} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-dark-900 dark:text-white">${order.total.toFixed(2)}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-4">
                            {order.items.map(i => `${i.quantity}x ${i.displayName || i.name}`).join(', ')}
                          </p>
                          <div className="flex gap-2">
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <button onClick={() => navigate(`/order/${order.id}`)} className="flex-1 py-2 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-semibold rounded-xl text-sm transition-colors hover:bg-primary-100">
                                Track Order
                              </button>
                            )}
                            <button onClick={() => handleReorder(order)} className={`flex-1 py-2 font-semibold rounded-xl text-sm transition-colors ${
                              order.status === 'delivered' || order.status === 'cancelled' ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-100 dark:bg-dark-800 text-dark-900 dark:text-white hover:bg-gray-200'
                            }`}>
                              Reorder
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FAVORITES TAB */}
              {activeTab === 'favorites' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-700 pb-4">Favorites</h2>
                  
                  <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Foods</h3>
                  {favoriteFoods.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {favoriteFoods.map(f => <FoodCard key={f.id} food={f} />)}
                    </div>
                  ) : <p className="text-sm text-gray-500 mb-8">No favorite foods yet.</p>}

                  <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4">Restaurants</h3>
                  {favoriteRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
                    </div>
                  ) : <p className="text-sm text-gray-500">No favorite restaurants yet.</p>}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="animate-fade-in max-w-xl">
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-700 pb-4">Saved Addresses</h2>
                  <AddressManager />
                </div>
              )}

              {/* WALLET TAB */}
              {activeTab === 'wallet' && (
                <div className="animate-fade-in max-w-md">
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-700 pb-4">Wallet & Rewards</h2>
                  <WalletCard />
                  <div className="mt-6 space-y-4">
                    <Link to="/wallet" className="btn-primary w-full justify-center">View Wallet Details</Link>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">Total Spent: ${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="animate-fade-in max-w-md space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4 border-b border-gray-100 dark:border-dark-700 pb-4">App Settings</h2>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-900 rounded-xl border border-gray-100 dark:border-dark-700">
                      <div>
                        <p className="font-bold text-dark-900 dark:text-white">Dark Mode</p>
                        <p className="text-xs text-gray-500">Toggle app appearance</p>
                      </div>
                      <DarkModeToggle />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-dark-900 dark:text-white mb-4 text-lg">Danger Zone</h3>
                    <button className="w-full text-left p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                      Delete Account
                    </button>
                    <p className="text-xs text-gray-500 mt-2">This action is permanent and cannot be undone.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
