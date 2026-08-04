import React, { useState } from 'react'
import { FaStar, FaQuoteLeft, FaUserCircle, FaPlus } from 'react-icons/fa'
import { useReviews } from '../contexts/ReviewsContext.jsx'

export default function Testimonials() {
  const { reviews, addReview } = useReviews()
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500 max-w-2xl">Real reviews from real food lovers who use QuickBite every day.</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus /> Leave Feedback
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-4">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((t) => (
              <div key={t.id} className="card p-6 hover:shadow-card-hover transition-all duration-300 group">
                <FaQuoteLeft className="text-primary-200 text-3xl mb-4 group-hover:text-primary-400 transition-colors" />
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">"{t.description}"</p>

                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100" />
                  ) : (
                    <FaUserCircle className="w-12 h-12 text-gray-300" />
                  )}
                  <div>
                    <p className="font-semibold text-dark-900 text-sm">{t.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-xs ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <FeedbackModal 
          onClose={() => setShowForm(false)} 
          onSubmit={(data) => {
            addReview(data)
            setShowForm(false)
          }} 
        />
      )}
    </section>
  )
}

function FeedbackModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(5)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) return
    onSubmit({ rating, description, name: name.trim() || 'Foodie' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-md shadow-xl p-6">
        <h3 className="text-xl font-bold text-dark-900 mb-4">Share Your Feedback</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <FaStar className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what you loved..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-dark-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!description.trim()}
              className="flex-1 py-3 rounded-xl btn-primary disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}