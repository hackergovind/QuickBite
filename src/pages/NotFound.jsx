import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaGhost } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-fade-in">
      <div className="text-center px-4">
        <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <FaGhost className="text-6xl text-primary-500" />
        </div>
        <h1 className="text-6xl sm:text-8xl font-extrabold text-dark-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Oops! The page you're looking for seems to have vanished into thin air. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 text-lg">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  )
}