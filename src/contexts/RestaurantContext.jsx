import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const RestaurantContext = createContext(null)

const STORAGE_KEY = 'cravedrop_owner_restaurants'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data).map(normalizeRestaurant) : []
  } catch {
    return []
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function parseNumber(value, fallback = 0) {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeRestaurant(restaurant) {
  return {
    ...restaurant,
    dishes: Array.isArray(restaurant?.dishes) ? restaurant.dishes : [],
    deliveryFee: parseNumber(restaurant?.deliveryFee),
    minOrder: parseNumber(restaurant?.minOrder),
    rating: restaurant?.rating ?? 0,
    reviewCount: restaurant?.reviewCount ?? 0,
    isOpen: restaurant?.isOpen ?? true,
    isOwnerCreated: restaurant?.isOwnerCreated ?? true,
  }
}

export function RestaurantProvider({ children }) {
  const [ownerRestaurants, setOwnerRestaurants] = useState(loadFromStorage)

  // Keep storage in sync whenever state changes
  useEffect(() => {
    saveToStorage(ownerRestaurants)
  }, [ownerRestaurants])

  // Create a new restaurant for a given owner
  const addRestaurant = useCallback((ownerId, data) => {
    const restaurant = {
      id: `owner-${Date.now()}`,
      ownerId,
      name: data.name || 'My Restaurant',
      description: data.description || '',
      cuisine: data.cuisine || 'Multi-Cuisine',
      deliveryTime: data.deliveryTime || '30–45 min',
      deliveryFee: parseNumber(data.deliveryFee),
      minOrder: parseNumber(data.minOrder),
      image: data.image || '',
      badge: 'New',
      category: data.category || 'all',
      rating: 0,
      reviewCount: 0,
      isOpen: true,
      phone: data.phone || '',
      address: data.address || '',
      dishes: [],
      isOwnerCreated: true,
    }
    setOwnerRestaurants(prev => [...prev, restaurant])
    return restaurant.id
  }, [])

  // Update restaurant info (profile tab save)
  const updateRestaurant = useCallback((restaurantId, data) => {
    setOwnerRestaurants(prev =>
      prev.map(r =>
        r.id === restaurantId
          ? {
              ...r,
              name: data.name ?? r.name,
              description: data.description ?? r.description,
              cuisine: data.cuisine ?? r.cuisine,
              deliveryTime: data.deliveryTime ?? r.deliveryTime,
              deliveryFee: data.deliveryFee !== undefined ? parseNumber(data.deliveryFee, r.deliveryFee) : r.deliveryFee,
              minOrder: data.minOrder !== undefined ? parseNumber(data.minOrder, r.minOrder) : r.minOrder,
              image: data.image ?? r.image,
              phone: data.phone ?? r.phone,
              address: data.address ?? r.address,
              category: data.category ?? r.category,
              dishes: Array.isArray(r.dishes) ? r.dishes : [],
            }
          : r
      )
    )
  }, [])

  // Add a dish to a restaurant
  const addDish = useCallback((restaurantId, dish) => {
    const newDish = {
      id: `dish-${Date.now()}`,
      restaurantId,
      name: dish.name || 'New Dish',
      description: dish.description || '',
      price: parseNumber(dish.price),
      image: dish.image || '',
      category: dish.category || 'other',
      rating: 0,
      calories: parseInt(dish.calories) || 0,
      isVeg: dish.isVeg || false,
      tags: dish.tags || [],
      isOwnerCreated: true,
    }
    setOwnerRestaurants(prev =>
      prev.map(r =>
        r.id === restaurantId
          ? { ...r, dishes: [...(Array.isArray(r.dishes) ? r.dishes : []), newDish] }
          : r
      )
    )
  }, [])

  // Update an existing dish
  const updateDish = useCallback((restaurantId, dishId, data) => {
    setOwnerRestaurants(prev =>
      prev.map(r =>
        r.id === restaurantId
          ? {
              ...r,
              dishes: (Array.isArray(r.dishes) ? r.dishes : []).map(d =>
                d.id === dishId ? { ...d, ...data, price: parseNumber(data.price, d.price), calories: parseInt(data.calories) || 0 } : d
              ),
            }
          : r
      )
    )
  }, [])

  // Delete a dish
  const deleteDish = useCallback((restaurantId, dishId) => {
    setOwnerRestaurants(prev =>
      prev.map(r =>
        r.id === restaurantId
          ? { ...r, dishes: (Array.isArray(r.dishes) ? r.dishes : []).filter(d => d.id !== dishId) }
          : r
      )
    )
  }, [])

  // Get the restaurant owned by a specific user
  const getOwnerRestaurant = useCallback(
    (ownerId) => ownerRestaurants.find(r => r.ownerId === ownerId) || null,
    [ownerRestaurants]
  )

  return (
    <RestaurantContext.Provider
      value={{
        ownerRestaurants,
        addRestaurant,
        updateRestaurant,
        addDish,
        updateDish,
        deleteDish,
        getOwnerRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export const useRestaurantOwner = () => {
  const context = useContext(RestaurantContext)
  if (!context) throw new Error('useRestaurantOwner must be used within RestaurantProvider')
  return context
}
