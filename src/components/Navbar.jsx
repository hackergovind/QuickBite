import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaBars, FaBell, FaMapMarkerAlt, FaStore } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useNotifications } from '../contexts/NotificationsContext.jsx'
import MobileMenu from './MobileMenu.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'
import NotificationDropdown from './NotificationDropdown.jsx'
import AISearchBar from './AISearchBar.jsx'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { totalItems } = useCart()
  const { user, isAuthenticated, role, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dark-950/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white text-xl font-bold">Q</span>
              </div>
              <span className="text-xl font-bold text-dark-900 dark:text-white hidden sm:block">
                Quick<span className="text-primary-500">Bite</span>
              </span>
            </Link>

            {/* AI Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <AISearchBar />
            </div>

            {/* Location - Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mr-2 shrink-0">
              <FaMapMarkerAlt className="text-primary-500" />
              <span>New York, NY</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dark Mode Toggle */}
              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors group"
                  >
                    <FaBell className="text-xl text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <NotificationDropdown onClose={() => setShowNotifications(false)} />
                  )}
                </div>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors group">
                <FaShoppingCart className="text-xl text-gray-700 dark:text-gray-300 group-hover:text-primary-500 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-slow">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  {role === 'owner' ? (
                    <Link
                      to="/owner-dashboard"
                      className="flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-3 py-2 rounded-xl transition-colors border border-orange-200 dark:border-orange-800 hover:border-orange-400"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <FaStore className="text-white text-xs" />
                      </div>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{user.name.split(' ')[0]}</span>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-semibold">Owner</span>
                    </Link>
                  ) : (
                    <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-dark-800 px-3 py-2 rounded-xl transition-colors">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name.split(' ')[0]}</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 px-4 py-2 transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm py-2">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <FaBars className="text-xl text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        role={role}
        logout={logout}
        totalItems={totalItems}
      />
    </>
  )
}