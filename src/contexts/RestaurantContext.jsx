import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { apiRequest } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const RestaurantContext = createContext(null)

export function RestaurantProvider({ children }) {
  const { user } = useAuth()
  const [ownerRestaurants, setOwnerRestaurants] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllRestaurants = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/restaurants')
      setOwnerRestaurants(data.restaurants || [])
    } catch (err) {
      console.error('Failed to fetch restaurants:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllRestaurants()
    // Poll every 30 seconds for new restaurants
    const interval = setInterval(fetchAllRestaurants, 30000)
    return () => clearInterval(interval)
  }, [fetchAllRestaurants])

  const addRestaurant = useCallback(async (ownerId, data) => {
    try {
      const result = await apiRequest('/restaurants', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      await fetchAllRestaurants()
      return result.id
    } catch (err) {
      console.error('addRestaurant error:', err)
      return null
    }
  }, [fetchAllRestaurants])

  const updateRestaurant = useCallback(async (restaurantId, data) => {
    try {
      await apiRequest(`/restaurants/${restaurantId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      await fetchAllRestaurants()
    } catch (err) {
      console.error('updateRestaurant error:', err)
    }
  }, [fetchAllRestaurants])

  const addDish = useCallback(async (restaurantId, dish) => {
    try {
      await apiRequest(`/restaurants/${restaurantId}/dishes`, {
        method: 'POST',
        body: JSON.stringify(dish)
      })
      await fetchAllRestaurants()
    } catch (err) {
      console.error('addDish error:', err)
    }
  }, [fetchAllRestaurants])

  const updateDish = useCallback(async (restaurantId, dishId, data) => {
    try {
      await apiRequest(`/restaurants/${restaurantId}/dishes/${dishId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      await fetchAllRestaurants()
    } catch (err) {
      console.error('updateDish error:', err)
    }
  }, [fetchAllRestaurants])

  const deleteDish = useCallback(async (restaurantId, dishId) => {
    try {
      await apiRequest(`/restaurants/${restaurantId}/dishes/${dishId}`, {
        method: 'DELETE'
      })
      await fetchAllRestaurants()
    } catch (err) {
      console.error('deleteDish error:', err)
    }
  }, [fetchAllRestaurants])

  const getOwnerRestaurant = useCallback(
    (ownerId) => ownerRestaurants.find(r => r.ownerId === ownerId) || null,
    [ownerRestaurants]
  )

  return (
    <RestaurantContext.Provider value={{
      ownerRestaurants,
      loading,
      addRestaurant,
      updateRestaurant,
      addDish,
      updateDish,
      deleteDish,
      getOwnerRestaurant,
      fetchAllRestaurants,
    }}>
      {children}
    </RestaurantContext.Provider>
  )
}

export const useRestaurantOwner = () => {
  const context = useContext(RestaurantContext)
  if (!context) throw new Error('useRestaurantOwner must be used within RestaurantProvider')
  return context
}
