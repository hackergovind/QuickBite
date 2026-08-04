import React, { createContext, useContext, useState, useCallback } from 'react'

const FavoritesContext = createContext(null)

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

export function FavoritesProvider({ children }) {
  const [favFoods, setFavFoods] = useState(() => load('qb_fav_foods'))
  const [favRestaurants, setFavRestaurants] = useState(() => load('qb_fav_restaurants'))

  const toggleFavoriteFood = useCallback((foodId) => {
    setFavFoods(prev => {
      const next = prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]
      save('qb_fav_foods', next)
      return next
    })
  }, [])

  const toggleFavoriteRestaurant = useCallback((restaurantId) => {
    setFavRestaurants(prev => {
      const next = prev.includes(restaurantId) ? prev.filter(id => id !== restaurantId) : [...prev, restaurantId]
      save('qb_fav_restaurants', next)
      return next
    })
  }, [])

  const isFavoriteFood = useCallback((foodId) => favFoods.includes(foodId), [favFoods])
  const isFavoriteRestaurant = useCallback((id) => favRestaurants.includes(id), [favRestaurants])

  return (
    <FavoritesContext.Provider value={{
      favFoods,
      favRestaurants,
      toggleFavoriteFood,
      toggleFavoriteRestaurant,
      isFavoriteFood,
      isFavoriteRestaurant,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
