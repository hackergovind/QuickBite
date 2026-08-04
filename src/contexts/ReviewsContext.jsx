import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ReviewsContext = createContext(null)

const REVIEWS_KEY = 'quickbite_reviews'

function loadReviews() {
  try {
    const data = localStorage.getItem(REVIEWS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(loadReviews)

  useEffect(() => {
    saveReviews(reviews)
  }, [reviews])

  const addReview = useCallback((review) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...review,
    }
    setReviews(prev => [newReview, ...prev])
  }, [])

  return (
    <ReviewsContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export const useReviews = () => {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}
