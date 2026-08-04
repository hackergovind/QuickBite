import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useReviews } from '../contexts/ReviewsContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ReviewForm({ restaurantId, onSuccess }) {
  const { addReview } = useReviews()
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating || !comment.trim()) return
    addReview({
      restaurantId,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest',
      userAvatar: user?.avatar,
      rating,
      comment: comment.trim(),
    })
    setSubmitted(true)
    onSuccess?.()
  }

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
        <div className="text-4xl mb-3">🎉</div>
        <p className="font-bold text-green-700 dark:text-green-400">Review submitted!</p>
        <p className="text-sm text-green-600 dark:text-green-500 mt-1">Thank you for your feedback.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 space-y-5">
      <h3 className="font-bold text-dark-900 dark:text-white">Write a Review</h3>

      {/* Stars */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Rating</p>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <FaStar className={`${i < (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200 dark:text-dark-600'} transition-colors`} />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300 self-center">
              {['', 'Terrible', 'Bad', 'OK', 'Good', 'Amazing!'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell others about your experience..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm text-dark-900 dark:text-white resize-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
      </div>

      <button
        type="submit"
        disabled={!rating || !comment.trim()}
        className="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Review
      </button>
    </form>
  )
}
