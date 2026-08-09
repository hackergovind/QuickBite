import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

const RestaurantContext = createContext(null)

function toRestaurant(row, dishes = []) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name || 'My Restaurant',
    description: row.description || '',
    cuisine: row.cuisine || 'Multi-Cuisine',
    deliveryTime: row.delivery_time || '30–45 min',
    deliveryFee: row.delivery_fee ?? 0,
    minOrder: row.min_order ?? 0,
    image: row.image || '',
    phone: row.phone || '',
    address: row.address || '',
    category: row.category || 'other',
    badge: row.badge || 'New',
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    isOpen: row.is_open !== false,
    isOwnerCreated: true,
    dishes: dishes.map(d => ({
      id: d.id,
      restaurantId: d.restaurant_id,
      name: d.name,
      description: d.description || '',
      price: d.price ?? 0,
      image: d.image || '',
      category: d.category || 'other',
      isVeg: d.is_veg || false,
      calories: d.calories || 0,
      rating: d.rating ?? 0,
      isOwnerCreated: true,
    })),
  }
}

export function RestaurantProvider({ children }) {
  const { user } = useAuth()
  const [ownerRestaurants, setOwnerRestaurants] = useState([])
  const [loading, setLoading] = useState(false)

  // Load ALL owner-created restaurants from Supabase (for catalog)
  const fetchAllRestaurants = useCallback(async () => {
    setLoading(true)
    try {
      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('*, dishes(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mapped = (restaurants || []).map(r => toRestaurant(r, r.dishes || []))
      setOwnerRestaurants(mapped)
    } catch (err) {
      console.error('Failed to fetch restaurants:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and subscribe to realtime changes
  useEffect(() => {
    fetchAllRestaurants()

    const channel = supabase
      .channel('restaurants-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => {
        fetchAllRestaurants()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dishes' }, () => {
        fetchAllRestaurants()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchAllRestaurants])

  const addRestaurant = useCallback(async (ownerId, data) => {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        owner_id: ownerId,
        name: data.name || 'My Restaurant',
        description: data.description || '',
        cuisine: data.cuisine || 'Multi-Cuisine',
        delivery_time: data.deliveryTime || '30–45 min',
        delivery_fee: parseFloat(data.deliveryFee) || 0,
        min_order: parseFloat(data.minOrder) || 0,
        image: data.image || '',
        phone: data.phone || '',
        address: data.address || '',
        category: data.category || 'other',
        badge: 'New',
        rating: 0,
        review_count: 0,
        is_open: true,
      })
      .select()
      .single()

    if (error) { console.error('addRestaurant error:', error); return null }
    await fetchAllRestaurants()
    return restaurant.id
  }, [fetchAllRestaurants])

  const updateRestaurant = useCallback(async (restaurantId, data) => {
    const { error } = await supabase
      .from('restaurants')
      .update({
        name: data.name,
        description: data.description,
        cuisine: data.cuisine,
        delivery_time: data.deliveryTime,
        delivery_fee: parseFloat(data.deliveryFee) || 0,
        min_order: parseFloat(data.minOrder) || 0,
        image: data.image,
        phone: data.phone,
        address: data.address,
        category: data.category,
      })
      .eq('id', restaurantId)

    if (error) console.error('updateRestaurant error:', error)
    else await fetchAllRestaurants()
  }, [fetchAllRestaurants])

  const addDish = useCallback(async (restaurantId, dish) => {
    const { error } = await supabase
      .from('dishes')
      .insert({
        restaurant_id: restaurantId,
        name: dish.name || 'New Dish',
        description: dish.description || '',
        price: parseFloat(dish.price) || 0,
        image: dish.image || '',
        category: dish.category || 'other',
        is_veg: dish.isVeg || false,
        calories: parseInt(dish.calories) || 0,
        rating: 0,
      })

    if (error) console.error('addDish error:', error)
    else await fetchAllRestaurants()
  }, [fetchAllRestaurants])

  const updateDish = useCallback(async (restaurantId, dishId, data) => {
    const { error } = await supabase
      .from('dishes')
      .update({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) || 0,
        image: data.image,
        category: data.category,
        is_veg: data.isVeg,
        calories: parseInt(data.calories) || 0,
      })
      .eq('id', dishId)
      .eq('restaurant_id', restaurantId)

    if (error) console.error('updateDish error:', error)
    else await fetchAllRestaurants()
  }, [fetchAllRestaurants])

  const deleteDish = useCallback(async (restaurantId, dishId) => {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', dishId)
      .eq('restaurant_id', restaurantId)

    if (error) console.error('deleteDish error:', error)
    else await fetchAllRestaurants()
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
