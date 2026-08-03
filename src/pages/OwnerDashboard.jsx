import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaStore, FaUtensils, FaCamera, FaPlus, FaEdit, FaTrash,
  FaSave, FaTimes, FaCheckCircle, FaImage, FaRupeeSign,
  FaClock, FaMotorcycle, FaMapMarkerAlt, FaPhone,
  FaLeaf, FaDrumstickBite, FaTag, FaChartBar, FaSignOutAlt
} from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'

const CUISINE_OPTIONS = [
  'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican',
  'Japanese', 'Thai', 'American', 'Mediterranean', 'Multi-Cuisine'
]

const CATEGORY_OPTIONS = [
  { value: 'burger', label: 'Burgers 🍔' },
  { value: 'pizza', label: 'Pizza 🍕' },
  { value: 'indian', label: 'Indian 🍛' },
  { value: 'chinese', label: 'Chinese 🥡' },
  { value: 'sushi', label: 'Sushi 🍣' },
  { value: 'dessert', label: 'Desserts 🍰' },
  { value: 'healthy', label: 'Healthy 🥗' },
  { value: 'mexican', label: 'Mexican 🌮' },
  { value: 'italian', label: 'Italian 🍝' },
  { value: 'other', label: 'Other 🍽️' },
]

// Convert uploaded file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Image upload component
function ImageUpload({ value, onChange, label, aspectRatio = 'landscape', id }) {
  const inputRef = useRef()
  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await fileToBase64(file)
    onChange(b64)
  }
  return (
    <div>
      {label && <p className="text-sm font-medium text-gray-300 mb-2">{label}</p>}
      <div
        onClick={() => inputRef.current.click()}
        className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-200 ${
          value ? 'border-transparent' : 'border-gray-600 hover:border-orange-500'
        } ${aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-2 text-white font-medium">
                <FaCamera />
                <span>Change Photo</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-orange-400 transition-colors">
            <FaImage className="text-3xl mb-2" />
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs mt-1">JPG, PNG, WEBP</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          id={id}
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  )
}

// Stat card for dashboard
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  )
}

// Dish Card
function DishCard({ dish, onEdit, onDelete }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
      <div className="relative aspect-video">
        {dish.image ? (
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <FaUtensils className="text-3xl text-gray-600" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {dish.isVeg ? (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <FaLeaf className="text-[10px]" /> Veg
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <FaDrumstickBite className="text-[10px]" /> Non-Veg
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => onEdit(dish)}
            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <FaEdit className="text-white text-xs" />
          </button>
          <button
            onClick={() => onDelete(dish.id)}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <FaTrash className="text-white text-xs" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm leading-tight">{dish.name}</h3>
          <span className="text-orange-400 font-bold text-sm whitespace-nowrap">₹{dish.price}</span>
        </div>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{dish.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
            <FaTag className="text-[9px]" /> {dish.category}
          </span>
        </div>
      </div>
    </div>
  )
}

// Dish form modal
function DishFormModal({ dish, restaurantId, onClose, onSave }) {
  const [form, setForm] = useState(
    dish
      ? { ...dish }
      : { name: '', description: '', price: '', category: 'other', isVeg: false, image: '', calories: '' }
  )
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    onSave(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">{dish ? 'Edit Dish' : 'Add New Dish'}</h3>
            <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <FaTimes className="text-white text-sm" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              id="dish-image-upload"
              value={form.image}
              onChange={(v) => setForm({ ...form, image: v })}
              label="Dish Photo"
              aspectRatio="landscape"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Dish Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Butter Chicken"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹) *</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Calories</label>
                <input
                  type="number"
                  min="0"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  placeholder="kcal"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the dish, ingredients, special notes..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm resize-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Diet Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isVeg: true })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                      form.isVeg
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-white/10 text-gray-400 hover:border-green-500/50'
                    }`}
                  >
                    <FaLeaf /> Vegetarian
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isVeg: false })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                      !form.isVeg
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-white/10 text-gray-400 hover:border-red-500/50'
                    }`}
                  >
                    <FaDrumstickBite /> Non-Veg
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {saving ? 'Saving...' : <><FaSave /> Save Dish</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const { getOwnerRestaurant, addRestaurant, updateRestaurant, addDish, updateDish, deleteDish } = useRestaurantOwner()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [saveStatus, setSaveStatus] = useState(null) // 'saving' | 'saved' | null
  const [showDishModal, setShowDishModal] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  const ownerRestaurant = getOwnerRestaurant(user?.id)

  const [profileForm, setProfileForm] = useState({
    name: ownerRestaurant?.name || '',
    description: ownerRestaurant?.description || '',
    cuisine: ownerRestaurant?.cuisine || 'Multi-Cuisine',
    category: ownerRestaurant?.category || 'other',
    deliveryTime: ownerRestaurant?.deliveryTime || '30–45 min',
    deliveryFee: ownerRestaurant?.deliveryFee ?? '',
    minOrder: ownerRestaurant?.minOrder ?? '',
    phone: ownerRestaurant?.phone || '',
    address: ownerRestaurant?.address || '',
    image: ownerRestaurant?.image || '',
  })

  // Refresh profile form when restaurant loaded/changes
  useEffect(() => {
    if (ownerRestaurant) {
      setProfileForm({
        name: ownerRestaurant.name || '',
        description: ownerRestaurant.description || '',
        cuisine: ownerRestaurant.cuisine || 'Multi-Cuisine',
        category: ownerRestaurant.category || 'other',
        deliveryTime: ownerRestaurant.deliveryTime || '30–45 min',
        deliveryFee: ownerRestaurant.deliveryFee ?? '',
        minOrder: ownerRestaurant.minOrder ?? '',
        phone: ownerRestaurant.phone || '',
        address: ownerRestaurant.address || '',
        image: ownerRestaurant.image || '',
      })
    }
  }, [ownerRestaurant?.id])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!profileForm.name) return
    setSaveStatus('saving')
    await new Promise(r => setTimeout(r, 500))

    if (ownerRestaurant) {
      updateRestaurant(ownerRestaurant.id, profileForm)
    } else {
      addRestaurant(user.id, profileForm)
    }
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 2500)
  }

  const handleAddDish = (form) => {
    if (!ownerRestaurant) return
    addDish(ownerRestaurant.id, form)
    setShowDishModal(false)
  }

  const handleEditDish = (form) => {
    if (!ownerRestaurant || !editingDish) return
    updateDish(ownerRestaurant.id, editingDish.id, form)
    setEditingDish(null)
  }

  const handleDeleteDish = (dishId) => {
    if (!ownerRestaurant) return
    if (window.confirm('Delete this dish? This cannot be undone.')) {
      deleteDish(ownerRestaurant.id, dishId)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dishes = ownerRestaurant?.dishes || []
  const totalDishes = dishes.length
  const vegCount = dishes.filter(d => d.isVeg).length

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'profile', label: 'Restaurant Profile', icon: <FaStore /> },
    { id: 'menu', label: 'Menu / Dishes', icon: <FaUtensils /> },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-gray-900 border-r border-white/5 px-4 py-6 fixed h-full z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <FaStore className="text-white text-sm" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Owner Panel</p>
            <p className="text-gray-500 text-xs">CraveDrop</p>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white/5 rounded-2xl p-3 mb-6 flex items-center gap-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">{user?.name}</p>
            <p className="text-orange-400 text-xs">Restaurant Owner</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-gray-900/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <FaStore className="text-white text-xs" />
            </div>
            <span className="text-white font-semibold text-sm">Owner Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
            <FaSignOutAlt />
          </button>
        </div>

        {/* Mobile tab bar */}
        <div className="lg:hidden flex overflow-x-auto bg-gray-900 border-b border-white/5 px-4 gap-1 py-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 lg:p-8 max-w-5xl">
          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-400 mt-1">
                  {ownerRestaurant
                    ? `Managing "${ownerRestaurant.name}"`
                    : 'Set up your restaurant profile to get started.'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={<FaStore className="text-orange-400" />}
                  label="Restaurant Status"
                  value={ownerRestaurant ? 'Active' : 'Not Set'}
                  color="bg-orange-500/20"
                />
                <StatCard
                  icon={<FaUtensils className="text-blue-400" />}
                  label="Total Dishes"
                  value={totalDishes}
                  color="bg-blue-500/20"
                />
                <StatCard
                  icon={<FaLeaf className="text-green-400" />}
                  label="Veg Items"
                  value={vegCount}
                  color="bg-green-500/20"
                />
                <StatCard
                  icon={<FaDrumstickBite className="text-red-400" />}
                  label="Non-Veg Items"
                  value={totalDishes - vegCount}
                  color="bg-red-500/20"
                />
              </div>

              {/* Restaurant card preview */}
              {ownerRestaurant ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                  <div className="relative h-48">
                    {ownerRestaurant.image ? (
                      <img src={ownerRestaurant.image} alt={ownerRestaurant.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <FaCamera className="text-4xl text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">New</span>
                      <h2 className="text-white text-xl font-bold mt-1">{ownerRestaurant.name}</h2>
                      <p className="text-white/70 text-sm">{ownerRestaurant.cuisine}</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <FaClock className="text-orange-400 mx-auto mb-1" />
                      <p className="text-white font-medium">{ownerRestaurant.deliveryTime}</p>
                      <p className="text-gray-500 text-xs">Delivery Time</p>
                    </div>
                    <div className="text-center">
                      <FaMotorcycle className="text-blue-400 mx-auto mb-1" />
                      <p className="text-white font-medium">
                        {ownerRestaurant.deliveryFee === 0 ? 'Free' : `₹${ownerRestaurant.deliveryFee}`}
                      </p>
                      <p className="text-gray-500 text-xs">Delivery Fee</p>
                    </div>
                    <div className="text-center">
                      <FaRupeeSign className="text-green-400 mx-auto mb-1" />
                      <p className="text-white font-medium">₹{ownerRestaurant.minOrder}</p>
                      <p className="text-gray-500 text-xs">Min Order</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-3xl p-8 text-center">
                  <FaStore className="text-4xl text-orange-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold text-lg mb-2">Set Up Your Restaurant</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Add your restaurant details so customers can find and order from you.
                  </p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Set Up Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Restaurant Profile</h2>
                <p className="text-gray-400 mt-1">This info is shown to customers on the app.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Cover Photo */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FaCamera className="text-orange-400" /> Cover Photo
                  </h3>
                  <ImageUpload
                    id="restaurant-cover-upload"
                    value={profileForm.image}
                    onChange={(v) => setProfileForm({ ...profileForm, image: v })}
                    aspectRatio="landscape"
                  />
                </div>

                {/* Basic Info */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FaStore className="text-orange-400" /> Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Restaurant Name *</label>
                    <input
                      required
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Spice Garden"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                      placeholder="Tell customers what makes your restaurant special..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Cuisine Type</label>
                      <select
                        value={profileForm.cuisine}
                        onChange={(e) => setProfileForm({ ...profileForm, cuisine: e.target.value })}
                        className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      >
                        {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <select
                        value={profileForm.category}
                        onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                        className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                      >
                        {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FaMotorcycle className="text-orange-400" /> Delivery Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Delivery Time</label>
                      <div className="relative">
                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={profileForm.deliveryTime}
                          onChange={(e) => setProfileForm({ ...profileForm, deliveryTime: e.target.value })}
                          placeholder="e.g. 30–45 min"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Delivery Fee (₹)</label>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={profileForm.deliveryFee}
                          onChange={(e) => setProfileForm({ ...profileForm, deliveryFee: e.target.value })}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Min. Order (₹)</label>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={profileForm.minOrder}
                          onChange={(e) => setProfileForm({ ...profileForm, minOrder: e.target.value })}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-400" /> Contact &amp; Location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          placeholder="123 Main Street, City"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {saveStatus === 'saving' ? (
                    <span>Saving...</span>
                  ) : saveStatus === 'saved' ? (
                    <><FaCheckCircle className="text-green-300" /> Saved Successfully!</>
                  ) : (
                    <><FaSave /> Save Restaurant Profile</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ─── MENU TAB ─── */}
          {activeTab === 'menu' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Menu Management</h2>
                  <p className="text-gray-400 mt-1">
                    {totalDishes} {totalDishes === 1 ? 'dish' : 'dishes'} on your menu
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!ownerRestaurant) {
                      alert('Please set up your restaurant profile first!')
                      setActiveTab('profile')
                      return
                    }
                    setEditingDish(null)
                    setShowDishModal(true)
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                  <FaPlus /> Add Dish
                </button>
              </div>

              {!ownerRestaurant && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5 mb-6 flex items-start gap-3">
                  <span className="text-yellow-400 text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Restaurant profile not set up</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Save your restaurant profile before adding dishes.{' '}
                      <button onClick={() => setActiveTab('profile')} className="underline text-orange-400">
                        Go to Profile
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {dishes.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                  <FaUtensils className="text-5xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">No dishes yet</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Start building your menu by adding your first dish.
                  </p>
                  <button
                    onClick={() => {
                      if (!ownerRestaurant) { setActiveTab('profile'); return }
                      setShowDishModal(true)
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    <FaPlus /> Add Your First Dish
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {dishes.map(dish => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      onEdit={(d) => { setEditingDish(d); setShowDishModal(true) }}
                      onDelete={handleDeleteDish}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dish Modal */}
      {showDishModal && ownerRestaurant && (
        <DishFormModal
          dish={editingDish}
          restaurantId={ownerRestaurant.id}
          onClose={() => { setShowDishModal(false); setEditingDish(null) }}
          onSave={editingDish ? handleEditDish : handleAddDish}
        />
      )}
    </div>
  )
}
