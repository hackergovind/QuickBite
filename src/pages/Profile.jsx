import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaSignOutAlt, FaShoppingBag, FaHeart } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Profile() {
  const navigate = useNavigate()
  const { user, role, logout, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  // Restaurant owners should not access the customer profile page
  if (role === 'owner') {
    return <Navigate to="/owner-dashboard" replace />
  }

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100 mx-auto"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                  <FaEdit className="text-xs" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-dark-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{user?.email}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 text-primary-700 font-medium">
                  <FaUser /> Profile
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 cursor-pointer transition-colors">
                  <FaShoppingBag /> My Orders
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-600 cursor-pointer transition-colors">
                  <FaHeart /> Favorites
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left"
                >
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-primary-500 font-medium hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-secondary-500 font-medium hover:bg-secondary-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FaSave /> Save
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Add phone number"
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Add your delivery address"
                      rows={3}
                      className="input-field pl-10 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-primary-500">12</p>
                <p className="text-xs text-gray-500 mt-1">Orders</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-secondary-500">5</p>
                <p className="text-xs text-gray-500 mt-1">Favorites</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                <p className="text-2xl font-bold text-purple-500">$248</p>
                <p className="text-xs text-gray-500 mt-1">Spent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}