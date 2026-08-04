import React, { useState } from 'react'
import { FaStar, FaThumbsUp, FaReply } from 'react-icons/fa'
import { useReviews } from '../contexts/ReviewsContext.jsx'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function ReviewCard({ review, isOwner = false }) {
  const { likeReview, addOwnerReply } = useReviews()
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    if (!liked) {
      likeReview(review.id)
      setLiked(true)
    }
  }

  const handleReply = () => {
    if (replyText.trim()) {
      addOwnerReply(review.id, replyText.trim())
      setShowReplyBox(false)
      setReplyText('')
    }
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-bold text-sm text-dark-900 dark:text-white">{review.userName}</p>
            <p className="text-xs text-gray-400">{timeAgo(review.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-dark-600'}`} />
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? 'text-primary-500' : 'text-gray-400 hover:text-primary-500'}`}
        >
          <FaThumbsUp />
          <span>{review.likes + (liked ? 1 : 0)} Helpful</span>
        </button>
        {isOwner && !review.ownerReply && (
          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-secondary-500 transition-colors"
          >
            <FaReply /> Reply
          </button>
        )}
      </div>

      {/* Owner Reply */}
      {review.ownerReply && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 rounded-r-xl p-3">
          <p className="text-xs font-bold text-primary-700 dark:text-primary-400 mb-1">🏪 Owner Reply</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{review.ownerReply}</p>
        </div>
      )}

      {/* Reply Box */}
      {showReplyBox && (
        <div className="space-y-2">
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write your reply as owner..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm text-dark-900 dark:text-white resize-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          <div className="flex gap-2">
            <button onClick={handleReply} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-lg transition-colors">
              Post Reply
            </button>
            <button onClick={() => setShowReplyBox(false)} className="px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
