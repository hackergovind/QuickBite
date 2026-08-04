import React, { useState } from 'react'
import { FaHome, FaBriefcase, FaMapMarkerAlt, FaPlus, FaTimes, FaCheck, FaLocationArrow } from 'react-icons/fa'

const TYPE_ICONS = {
  home: <FaHome />,
  work: <FaBriefcase />,
  other: <FaMapMarkerAlt />,
}

const SAMPLE_ADDRESSES = [
  { id: 'a1', type: 'home', label: 'Home', address: '42 Maple Street, New York, NY 10001' },
  { id: 'a2', type: 'work', label: 'Work', address: '100 Business Park, Manhattan, NY 10002' },
]

function loadAddresses() {
  try {
    const data = localStorage.getItem('qb_addresses')
    return data ? JSON.parse(data) : SAMPLE_ADDRESSES
  } catch { return SAMPLE_ADDRESSES }
}
function saveAddresses(addrs) { localStorage.setItem('qb_addresses', JSON.stringify(addrs)) }

export default function AddressManager({ selectedId, onSelect, showAdd = true }) {
  const [addresses, setAddresses] = useState(loadAddresses)
  const [adding, setAdding] = useState(false)
  const [newAddr, setNewAddr] = useState({ type: 'home', label: 'Home', address: '' })
  const [locationLoading, setLocationLoading] = useState(false)

  const addAddress = () => {
    if (!newAddr.address.trim()) return
    const updated = [...addresses, { ...newAddr, id: `a-${Date.now()}` }]
    setAddresses(updated)
    saveAddresses(updated)
    setAdding(false)
    setNewAddr({ type: 'home', label: 'Home', address: '' })
  }

  const removeAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    saveAddresses(updated)
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const addr = `Near you (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        setNewAddr(prev => ({ ...prev, address: addr }))
        setLocationLoading(false)
      },
      () => {
        setNewAddr(prev => ({ ...prev, address: 'Current Location (Mock), New York, NY' }))
        setLocationLoading(false)
      }
    )
  }

  return (
    <div className="space-y-3">
      {addresses.map(addr => (
        <div
          key={addr.id}
          onClick={() => onSelect?.(addr)}
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all group ${
            selectedId === addr.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-primary-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedId === addr.id ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-700 text-gray-500'}`}>
            {TYPE_ICONS[addr.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-dark-900 dark:text-white">{addr.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{addr.address}</p>
          </div>
          <div className="flex items-center gap-2">
            {selectedId === addr.id && <FaCheck className="text-primary-500" />}
            <button onClick={e => { e.stopPropagation(); removeAddress(addr.id) }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all">
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>
      ))}

      {showAdd && !adding && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-3 w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-700 text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-all">
          <FaPlus className="text-sm" />
          <span className="text-sm font-medium">Add New Address</span>
        </button>
      )}

      {adding && (
        <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 space-y-4">
          <div className="flex gap-2">
            {[{ id: 'home', label: '🏠 Home' }, { id: 'work', label: '💼 Work' }, { id: 'other', label: '📍 Other' }].map(t => (
              <button key={t.id} onClick={() => setNewAddr(prev => ({ ...prev, type: t.id, label: t.label.replace(/^\S+\s/, '') }))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${newAddr.type === t.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={newAddr.address}
              onChange={e => setNewAddr(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address..."
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm text-dark-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            <button onClick={getCurrentLocation} disabled={locationLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors">
              <FaLocationArrow className={`text-sm ${locationLoading ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={addAddress} className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-xl transition-colors">Save</button>
            <button onClick={() => setAdding(false)} className="flex-1 py-2.5 bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
