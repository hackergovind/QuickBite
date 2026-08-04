import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { mockReviews } from '../data/dummyData.js'

const ReviewsContext = createContext(null)

function loadReviews() {
  try {
    const data = localStorage.getItem('qb_reviews')
    return data ? JSON.parse(data) : mockReviews
  } catch { return mockReviews }
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(loadReviews)

  useEffect(() => {
    localStorage.setItem('qb_reviews', JSON.stringify(reviews))
  }, [reviews])

  const addReview = useCallback(({ restaurantId, userId, userName, userAvatar, rating, comment }) => {
    const r = {
      id: `r-${Date.now()}`,
      restaurantId,
      userId,
      userName,
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      rating,
      comment,
      date: new Date().toISOString(),
      likes: 0,
      ownerReply: null,
    }
    setReviews(prev => [r, ...prev])
    return r.id
  }, [])

  const likeReview = useCallback((reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r))
  }, [])

  const addOwnerReply = useCallback((reviewId, reply) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ownerReply: reply } : r))
  }, [])

  const getReviewsByRestaurant = useCallback(
    (restaurantId) => reviews.filter(r => r.restaurantId === restaurantId),
    [reviews]
  )

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, likeReview, addOwnerReply, getReviewsByRestaurant }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export const useReviews = () => {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}
