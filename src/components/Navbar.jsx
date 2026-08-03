import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaStore } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import MobileMenu from './MobileMenu.jsx'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const { user, isAuthenticated, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white text-xl font-bold">Q</span>
              </div>
              <span className="text-xl font-bold text-dark-900 hidden sm:block">
                Quick<span className="text-primary-500">Bite</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for food, restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-200 text-sm"
                />
              </div>
            </form>

            {/* Location - Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 mr-4">
              <FaMapMarkerAlt className="text-primary-500" />
              <span>New York, NY</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group">
                <FaShoppingCart className="text-xl text-gray-700 group-hover:text-primary-500 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-slow">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  {role === 'owner' ? (
                    <Link
                      to="/owner-dashboard"
                      className="flex items-center gap-2 hover:bg-orange-50 px-3 py-2 rounded-xl transition-colors border border-orange-200 hover:border-orange-400"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <FaStore className="text-white text-xs" />
                      </div>
                      <span className="text-sm font-medium text-orange-600">{user.name.split(' ')[0]}</span>
                      <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">Owner</span>
                    </Link>
                  ) : (
                    <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-500 px-4 py-2 transition-colors">
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
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <FaBars className="text-xl text-gray-700" />
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