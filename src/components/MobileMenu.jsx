import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTimes, FaHome, FaStore, FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaTachometerAlt } from 'react-icons/fa'

export default function MobileMenu({ isOpen, onClose, isAuthenticated, user, role, logout, totalItems }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const menuItems = [
    { to: '/', icon: FaHome, label: 'Home' },
    { to: '/restaurants', icon: FaStore, label: 'Restaurants' },
    { to: '/cart', icon: FaShoppingCart, label: 'Cart', badge: totalItems },
  ]

  if (isAuthenticated) {
    if (role === 'owner') {
      menuItems.push({ to: '/owner-dashboard', icon: FaTachometerAlt, label: 'My Dashboard' })
    } else {
      menuItems.push({ to: '/profile', icon: FaUser, label: 'Profile' })
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-dark-900">Menu</span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <FaTimes className="text-xl text-gray-600" />
            </button>
          </div>

          {isAuthenticated && user && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 ${
              role === 'owner' ? 'bg-orange-50 border border-orange-200' : 'bg-primary-50'
            }`}>
              {role === 'owner' ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <FaStore className="text-white text-lg" />
                </div>
              ) : (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              )}
              <div>
                <p className="font-bold text-dark-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                {role === 'owner' && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block">Restaurant Owner</span>
                )}
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <item.icon className="text-xl text-gray-400 group-hover:text-primary-500 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-dark-900">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-primary-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 text-red-600 w-full transition-colors"
              >
                <FaSignOutAlt className="text-xl" />
                <span className="font-medium">Log Out</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FaSignInAlt className="text-xl text-gray-400" />
                  <span className="font-medium text-gray-700">Log In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="btn-primary w-full text-center block"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}