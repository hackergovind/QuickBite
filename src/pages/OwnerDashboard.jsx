import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaStore, FaUtensils, FaCamera, FaPlus, FaEdit, FaTrash,
  FaSave, FaTimes, FaCheckCircle, FaImage, FaRupeeSign,
  FaClock, FaMotorcycle, FaMapMarkerAlt, FaPhone,
  FaLeaf, FaDrumstickBite, FaTag, FaChartBar, FaSignOutAlt,
  FaBolt, FaShoppingBag, FaWallet, FaArrowUp, FaUser,
  FaCheck, FaTruck, FaBan, FaClipboardList, FaChevronDown
} from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'
import { useOrders, STATUS_LABEL, STATUS_COLOR, ORDER_STATUS } from '../contexts/OrdersContext.jsx'

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// QuickBite Logo mark
function QBLogo({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'
  return (
    <div className={`${sizeClass} bg-primary-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300 shadow-md`}>
      <span className="text-white font-bold">Q</span>
    </div>
  )
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
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div
        onClick={() => inputRef.current.click()}
        className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-200 ${
          value ? 'border-transparent' : 'border-gray-300 hover:border-primary-500'
        } ${aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'}`}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-2 text-white font-medium bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                <FaCamera />
                <span>Change Photo</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors bg-gray-50">
            <FaImage className="text-3xl mb-2" />
            <p className="text-sm font-medium">Click to upload</p>
            <p className="text-xs mt-1 text-gray-400">JPG, PNG, WEBP</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" id={id} className="hidden" onChange={handleFile} />
      </div>
    </div>
  )
}

// Avatar upload — circular style for the sidebar
function AvatarUpload({ value, onChange }) {
  const inputRef = useRef()
  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await fileToBase64(file)
    onChange(b64)
  }
  return (
    <div
      onClick={() => inputRef.current.click()}
      className="relative w-10 h-10 cursor-pointer group"
    >
      {value ? (
        <img src={value} alt="avatar" className="w-10 h-10 rounded-xl object-cover border-2 border-primary-200" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center border-2 border-primary-200">
          <FaUser className="text-primary-400 text-sm" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <FaCamera className="text-white text-xs" />
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// Stat card
function StatCard({ icon, label, value, accent, sub }) {
  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-dark-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-primary-500 font-medium mt-1">{sub}</p>}
    </div>
  )
}

// Dish Card
function DishCard({ dish, onEdit, onDelete }) {
  return (
    <div className="card group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        {dish.image ? (
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FaUtensils className="text-3xl text-gray-300" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {dish.isVeg ? (
            <span className="bg-secondary-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium shadow">
              <FaLeaf className="text-[10px]" /> Veg
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium shadow">
              <FaDrumstickBite className="text-[10px]" /> Non-Veg
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => onEdit(dish)}
            className="w-8 h-8 bg-white hover:bg-primary-50 border border-gray-200 rounded-lg flex items-center justify-center transition-colors shadow"
          >
            <FaEdit className="text-primary-500 text-xs" />
          </button>
          <button
            onClick={() => onDelete(dish.id)}
            className="w-8 h-8 bg-white hover:bg-red-50 border border-gray-200 rounded-lg flex items-center justify-center transition-colors shadow"
          >
            <FaTrash className="text-red-500 text-xs" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-dark-900 text-sm leading-tight">{dish.name}</h3>
          <span className="text-primary-500 font-bold text-sm whitespace-nowrap">₹{dish.price}</span>
        </div>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{dish.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-primary-50 text-primary-600 text-xs px-2.5 py-0.5 rounded-full capitalize flex items-center gap-1 font-medium">
            <FaTag className="text-[9px]" /> {dish.category}
          </span>
        </div>
      </div>
    </div>
  )
}

// Shared input/field helpers
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"
const selectCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-dark-900">{dish ? 'Edit Dish' : 'Add New Dish'}</h3>
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <FaTimes className="text-gray-600 text-sm" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload id="dish-image-upload" value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Dish Photo" aspectRatio="landscape" />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Dish Name *">
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Butter Chicken" className={inputCls} />
                </Field>
              </div>
              <Field label="Price (₹) *">
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className={inputCls + ' pl-8'} />
                </div>
              </Field>
              <Field label="Calories">
                <input type="number" min="0" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="kcal" className={inputCls} />
              </Field>
              <div className="col-span-2">
                <Field label="Category">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectCls}>
                    {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Description">
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the dish..." rows={3} className={inputCls + ' resize-none'} />
                </Field>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm({ ...form, isVeg: true })} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${form.isVeg ? 'border-secondary-500 bg-secondary-50 text-secondary-600' : 'border-gray-200 text-gray-500 hover:border-secondary-300'}`}>
                    <FaLeaf /> Vegetarian
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, isVeg: false })} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${!form.isVeg ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500 hover:border-red-300'}`}>
                    <FaDrumstickBite /> Non-Veg
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-dark-900 hover:border-gray-400 hover:bg-gray-50 transition-all text-sm font-medium">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl btn-primary flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
                {saving ? 'Saving...' : <><FaSave /> Save Dish</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Order Row component ──
const STATUS_STEPS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.OUT,
  ORDER_STATUS.DELIVERED,
]

function OrderRow({ order, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false)

  const nextStatus = () => {
    const idx = STATUS_STEPS.indexOf(order.status)
    if (idx >= 0 && idx < STATUS_STEPS.length - 1) {
      onUpdateStatus(order.id, STATUS_STEPS[idx + 1])
    }
  }
  const canAdvance = order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED
  const canCancel = order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED

  const placedTime = new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const placedDate = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <div className="card overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FaShoppingBag className="text-primary-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-dark-900 text-sm">#{order.id.slice(-6).toUpperCase()}</p>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5 truncate">{order.customerName} · {order.items.length} item{order.items.length > 1 ? 's' : ''} · {placedDate} {placedTime}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-dark-900 text-sm">₹{order.total.toFixed(0)}</p>
          <FaChevronDown className={`text-gray-400 text-xs mt-1 ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50 animate-slide-down space-y-4">
          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items Ordered</p>
            <div className="space-y-1.5">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.quantity}× {item.name}</span>
                  <span className="font-medium text-dark-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill breakdown */}
          <div className="bg-white rounded-xl p-3 space-y-1.5 border border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span><span>₹{order.subtotal?.toFixed(0) || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery Fee</span><span>{order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tax</span><span>₹{order.tax?.toFixed(0) || 0}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-dark-900 border-t border-gray-100 pt-1.5 mt-1.5">
              <span>Total</span><span className="text-primary-600">₹{order.total.toFixed(0)}</span>
            </div>
          </div>

          {/* Customer info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p><span className="font-medium text-gray-700">Customer:</span> {order.customerName}</p>
            <p><span className="font-medium text-gray-700">Address:</span> {order.customerAddress}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            {canAdvance && (
              <button
                onClick={(e) => { e.stopPropagation(); nextStatus() }}
                className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
              >
                <FaCheck />
                {order.status === ORDER_STATUS.PENDING && 'Confirm'}
                {order.status === ORDER_STATUS.CONFIRMED && 'Start Preparing'}
                {order.status === ORDER_STATUS.PREPARING && 'Mark Out for Delivery'}
                {order.status === ORDER_STATUS.OUT && 'Mark Delivered'}
              </button>
            )}
            {canCancel && (
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, ORDER_STATUS.CANCELLED) }}
                className="flex items-center gap-2 text-xs py-2 px-4 rounded-xl border border-gray-200 text-red-500 hover:bg-red-50 transition-colors font-medium"
              >
                <FaBan /> Cancel
              </button>
            )}
            {!canAdvance && !canCancel && (
              <span className="text-xs text-gray-400 italic">No further actions</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ──
export default function OwnerDashboard() {
  const { user, logout, updateProfile } = useAuth()
  const { getOwnerRestaurant, addRestaurant, updateRestaurant, addDish, updateDish, deleteDish } = useRestaurantOwner()
  const { getOrdersByRestaurant, updateOrderStatus } = useOrders()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [saveStatus, setSaveStatus] = useState(null)
  const [showDishModal, setShowDishModal] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [orderFilter, setOrderFilter] = useState('all')

  const ownerRestaurant = getOwnerRestaurant(user?.id)
  const restaurantOrders = ownerRestaurant ? getOrdersByRestaurant(ownerRestaurant.id) : []

  // ── Earnings computations ──
  const deliveredOrders = restaurantOrders.filter(o => o.status === ORDER_STATUS.DELIVERED)
  const totalEarnings = deliveredOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0)
  const todayStr = new Date().toDateString()
  const todayOrders = restaurantOrders.filter(o => new Date(o.placedAt).toDateString() === todayStr)
  const todayEarnings = todayOrders.filter(o => o.status === ORDER_STATUS.DELIVERED).reduce((sum, o) => sum + (o.subtotal || 0), 0)
  const pendingCount = restaurantOrders.filter(o => o.status === ORDER_STATUS.PENDING).length

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

  const handleAvatarChange = async (b64) => {
    updateProfile({ avatar: b64 })
  }

  const dishes = ownerRestaurant?.dishes || []
  const totalDishes = dishes.length
  const vegCount = dishes.filter(d => d.isVeg).length

  const TABS = [
    { id: 'overview',  label: 'Overview',            icon: <FaChartBar /> },
    { id: 'orders',    label: 'Live Orders',          icon: <FaShoppingBag />, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'earnings',  label: 'Earnings',             icon: <FaWallet /> },
    { id: 'profile',   label: 'Restaurant Profile',   icon: <FaStore /> },
    { id: 'menu',      label: 'Menu / Dishes',        icon: <FaUtensils /> },
  ]

  // Filter for orders tab
  const filteredOrders = orderFilter === 'all'
    ? restaurantOrders
    : restaurantOrders.filter(o => o.status === orderFilter)

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 shadow-sm px-4 py-6 fixed h-full z-10">
        {/* QuickBite Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <QBLogo />
          <div>
            <span className="text-dark-900 font-bold text-lg leading-none">
              Quick<span className="text-primary-500">Bite</span>
            </span>
            <p className="text-gray-400 text-xs mt-0.5">Owner Panel</p>
          </div>
        </div>

        {/* Owner Info — with avatar upload */}
        <div className="bg-primary-50 rounded-2xl p-3 mb-6 flex items-center gap-3 border border-primary-100">
          <div className="relative flex-shrink-0 group">
            <AvatarUpload value={user?.avatar} onChange={handleAvatarChange} />
          </div>
          <div className="min-w-0">
            <p className="text-dark-900 font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-primary-500 text-xs font-medium">Restaurant Owner</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Click photo to change</p>
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
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                  : 'text-gray-500 hover:text-dark-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="flex-1 text-left">{tab.label}</span>
              {tab.badge && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${activeTab === tab.id ? 'bg-white text-primary-500' : 'bg-primary-500 text-white'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QBLogo size="sm" />
            <span className="text-dark-900 font-bold text-sm">
              Quick<span className="text-primary-500">Bite</span>
            </span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
            <FaSignOutAlt />
          </button>
        </div>

        {/* Mobile tab bar */}
        <div className="lg:hidden flex overflow-x-auto bg-white border-b border-gray-100 px-4 gap-1 py-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all relative ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:text-dark-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 lg:p-8 max-w-5xl">

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-dark-900">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 mt-1">
                  {ownerRestaurant ? `Managing "${ownerRestaurant.name}"` : 'Set up your restaurant profile to get started.'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<FaStore className="text-primary-500" />} label="Restaurant Status" value={ownerRestaurant ? 'Active' : 'Not Set'} accent="bg-primary-100" />
                <StatCard icon={<FaShoppingBag className="text-blue-500" />} label="Total Orders" value={restaurantOrders.length} accent="bg-blue-100" sub={pendingCount > 0 ? `${pendingCount} pending` : null} />
                <StatCard icon={<FaWallet className="text-secondary-600" />} label="Total Earnings" value={`₹${totalEarnings.toFixed(0)}`} accent="bg-secondary-100" sub={todayEarnings > 0 ? `₹${todayEarnings.toFixed(0)} today` : null} />
                <StatCard icon={<FaUtensils className="text-orange-500" />} label="Menu Items" value={totalDishes} accent="bg-orange-100" />
              </div>

              {/* Today's quick summary */}
              {restaurantOrders.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="card p-5 border-l-4 border-l-amber-400">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">{restaurantOrders.filter(o => o.status === ORDER_STATUS.PENDING).length}</p>
                  </div>
                  <div className="card p-5 border-l-4 border-l-orange-400">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preparing</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {restaurantOrders.filter(o => o.status === ORDER_STATUS.CONFIRMED || o.status === ORDER_STATUS.PREPARING).length}
                    </p>
                  </div>
                  <div className="card p-5 border-l-4 border-l-green-400">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivered</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{deliveredOrders.length}</p>
                  </div>
                </div>
              )}

              {/* Restaurant preview card */}
              {ownerRestaurant ? (
                <div className="card overflow-hidden">
                  <div className="relative h-48">
                    {ownerRestaurant.image ? (
                      <img src={ownerRestaurant.image} alt={ownerRestaurant.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FaCamera className="text-4xl text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-primary-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">Live</span>
                      <h2 className="text-white text-xl font-bold mt-1">{ownerRestaurant.name}</h2>
                      <p className="text-white/75 text-sm">{ownerRestaurant.cuisine}</p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-3 gap-4 text-sm border-t border-gray-100">
                    <div className="text-center">
                      <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                        <FaClock className="text-primary-500" />
                      </div>
                      <p className="text-dark-900 font-semibold">{ownerRestaurant.deliveryTime}</p>
                      <p className="text-gray-400 text-xs">Delivery Time</p>
                    </div>
                    <div className="text-center">
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                        <FaMotorcycle className="text-blue-500" />
                      </div>
                      <p className="text-dark-900 font-semibold">
                        {ownerRestaurant.deliveryFee === 0 ? 'Free' : `₹${ownerRestaurant.deliveryFee}`}
                      </p>
                      <p className="text-gray-400 text-xs">Delivery Fee</p>
                    </div>
                    <div className="text-center">
                      <div className="w-9 h-9 bg-secondary-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                        <FaRupeeSign className="text-secondary-600" />
                      </div>
                      <p className="text-dark-900 font-semibold">₹{ownerRestaurant.minOrder}</p>
                      <p className="text-gray-400 text-xs">Min Order</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-primary-50 to-orange-50 border border-primary-200 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaStore className="text-3xl text-primary-500" />
                  </div>
                  <h3 className="text-dark-900 font-bold text-xl mb-2">Set Up Your Restaurant</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                    Add your restaurant details so customers can find and order from you.
                  </p>
                  <button onClick={() => setActiveTab('profile')} className="btn-primary inline-flex items-center gap-2">
                    <FaBolt /> Set Up Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── LIVE ORDERS TAB ─── */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-dark-900">Live Orders</h2>
                  <p className="text-gray-500 mt-1">{restaurantOrders.length} total orders · {pendingCount} awaiting action</p>
                </div>
                {/* Auto-refresh indicator */}
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live
                </div>
              </div>

              {/* Filter chips */}
              <div className="flex gap-2 flex-wrap mb-5">
                {[
                  { key: 'all', label: 'All' },
                  { key: ORDER_STATUS.PENDING, label: 'Pending' },
                  { key: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
                  { key: ORDER_STATUS.PREPARING, label: 'Preparing' },
                  { key: ORDER_STATUS.OUT, label: 'Out for Delivery' },
                  { key: ORDER_STATUS.DELIVERED, label: 'Delivered' },
                  { key: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setOrderFilter(f.key)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                      orderFilter === f.key
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {f.label}
                    {f.key !== 'all' && restaurantOrders.filter(o => o.status === f.key).length > 0 && (
                      <span className="ml-1 opacity-75">({restaurantOrders.filter(o => o.status === f.key).length})</span>
                    )}
                  </button>
                ))}
              </div>

              {!ownerRestaurant ? (
                <div className="card p-10 text-center">
                  <FaStore className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Set up your restaurant first to start receiving orders.</p>
                  <button onClick={() => setActiveTab('profile')} className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                    <FaBolt /> Set Up Restaurant
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaClipboardList className="text-3xl text-gray-300" />
                  </div>
                  <h3 className="text-dark-900 font-bold text-lg mb-2">No orders yet</h3>
                  <p className="text-gray-500 text-sm">Orders from customers will appear here in real time.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map(order => (
                    <OrderRow key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── EARNINGS TAB ─── */}
          {activeTab === 'earnings' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark-900">Earnings</h2>
                <p className="text-gray-500 mt-1">Revenue from delivered orders</p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                      <FaWallet className="text-secondary-600" />
                    </div>
                    <span className="text-xs text-secondary-600 font-semibold bg-secondary-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaArrowUp className="text-[9px]" /> Total
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-dark-900">₹{totalEarnings.toFixed(0)}</p>
                  <p className="text-sm text-gray-500 mt-1">All-time Revenue</p>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <FaShoppingBag className="text-primary-500" />
                    </div>
                    <span className="text-xs text-primary-500 font-semibold bg-primary-50 px-2 py-0.5 rounded-full">Today</span>
                  </div>
                  <p className="text-3xl font-bold text-dark-900">₹{todayEarnings.toFixed(0)}</p>
                  <p className="text-sm text-gray-500 mt-1">Today's Revenue</p>
                </div>
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-blue-500" />
                    </div>
                    <span className="text-xs text-blue-500 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Count</span>
                  </div>
                  <p className="text-3xl font-bold text-dark-900">{deliveredOrders.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Delivered Orders</p>
                </div>
              </div>

              {/* Avg order value */}
              {deliveredOrders.length > 0 && (
                <div className="card p-5 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaRupeeSign className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Order Value</p>
                    <p className="text-2xl font-bold text-dark-900">₹{(totalEarnings / deliveredOrders.length).toFixed(0)}</p>
                  </div>
                </div>
              )}

              {/* Order history table */}
              <div className="card overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-dark-900">Completed Orders History</h3>
                </div>
                {deliveredOrders.length === 0 ? (
                  <div className="p-10 text-center">
                    <FaWallet className="text-4xl text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No completed orders yet. Earnings will show here once you deliver orders.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {deliveredOrders.map(order => (
                      <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaCheckCircle className="text-green-500 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-dark-900">#{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-500 truncate">{order.customerName} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-secondary-600">+₹{order.subtotal?.toFixed(0) || 0}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── PROFILE TAB ─── */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark-900">Restaurant Profile</h2>
                <p className="text-gray-500 mt-1">This info is shown to customers on the app.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="card p-6">
                  <h3 className="text-dark-900 font-semibold mb-4 flex items-center gap-2">
                    <FaCamera className="text-primary-500" /> Cover Photo
                  </h3>
                  <ImageUpload id="restaurant-cover-upload" value={profileForm.image} onChange={(v) => setProfileForm({ ...profileForm, image: v })} aspectRatio="landscape" />
                </div>

                <div className="card p-6 space-y-4">
                  <h3 className="text-dark-900 font-semibold flex items-center gap-2">
                    <FaStore className="text-primary-500" /> Basic Information
                  </h3>
                  <Field label="Restaurant Name *">
                    <input required type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="e.g. Spice Garden" className={inputCls} />
                  </Field>
                  <Field label="Description">
                    <textarea value={profileForm.description} onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} placeholder="Tell customers what makes your restaurant special..." rows={3} className={inputCls + ' resize-none'} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Cuisine Type">
                      <select value={profileForm.cuisine} onChange={(e) => setProfileForm({ ...profileForm, cuisine: e.target.value })} className={selectCls}>
                        {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Category">
                      <select value={profileForm.category} onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })} className={selectCls}>
                        {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="card p-6 space-y-4">
                  <h3 className="text-dark-900 font-semibold flex items-center gap-2">
                    <FaMotorcycle className="text-primary-500" /> Delivery Settings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Delivery Time">
                      <div className="relative">
                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={profileForm.deliveryTime} onChange={(e) => setProfileForm({ ...profileForm, deliveryTime: e.target.value })} placeholder="e.g. 30–45 min" className={inputCls + ' pl-10'} />
                      </div>
                    </Field>
                    <Field label="Delivery Fee (₹)">
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" min="0" step="0.01" value={profileForm.deliveryFee} onChange={(e) => setProfileForm({ ...profileForm, deliveryFee: e.target.value })} placeholder="0" className={inputCls + ' pl-8'} />
                      </div>
                    </Field>
                    <Field label="Min. Order (₹)">
                      <div className="relative">
                        <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" min="0" step="0.01" value={profileForm.minOrder} onChange={(e) => setProfileForm({ ...profileForm, minOrder: e.target.value })} placeholder="0" className={inputCls + ' pl-8'} />
                      </div>
                    </Field>
                  </div>
                </div>

                <div className="card p-6 space-y-4">
                  <h3 className="text-dark-900 font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-500" /> Contact &amp; Location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Phone">
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91 98765 43210" className={inputCls + ' pl-10'} />
                      </div>
                    </Field>
                    <Field label="Address">
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} placeholder="123 Main Street, City" className={inputCls + ' pl-10'} />
                      </div>
                    </Field>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="w-full py-4 rounded-2xl btn-primary text-base flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {saveStatus === 'saving' ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : saveStatus === 'saved' ? (
                    <><FaCheckCircle className="text-green-200" /> Saved Successfully!</>
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
                  <h2 className="text-2xl font-bold text-dark-900">Menu Management</h2>
                  <p className="text-gray-500 mt-1">{totalDishes} {totalDishes === 1 ? 'dish' : 'dishes'} on your menu</p>
                </div>
                <button
                  onClick={() => {
                    if (!ownerRestaurant) { alert('Please set up your restaurant profile first!'); setActiveTab('profile'); return }
                    setEditingDish(null)
                    setShowDishModal(true)
                  }}
                  className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
                >
                  <FaPlus /> Add Dish
                </button>
              </div>

              {!ownerRestaurant && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
                  <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-amber-700 font-medium text-sm">Restaurant profile not set up</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Save your restaurant profile before adding dishes.{' '}
                      <button onClick={() => setActiveTab('profile')} className="underline text-primary-500 font-medium">Go to Profile</button>
                    </p>
                  </div>
                </div>
              )}

              {dishes.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaUtensils className="text-3xl text-gray-300" />
                  </div>
                  <h3 className="text-dark-900 font-bold text-lg mb-2">No dishes yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Start building your menu by adding your first dish.</p>
                  <button
                    onClick={() => { if (!ownerRestaurant) { setActiveTab('profile'); return }; setShowDishModal(true) }}
                    className="btn-primary inline-flex items-center gap-2"
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
