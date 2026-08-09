import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api.js'

const CatalogContext = createContext(null)

const EMPTY_CATALOG = {
  categories: [],
  moodCategories: [],
  coupons: [],
  deliveryPartners: [],
  mockReviews: [],
  restaurants: [],
  foods: [],
  testimonials: [],
  offers: []
}

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(EMPTY_CATALOG)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshCatalog = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const data = await apiRequest('/catalog')

      const localOwnerData = localStorage.getItem('cravedrop_owner_restaurants')
      const ownerRestaurants = localOwnerData ? JSON.parse(localOwnerData) : []
      
      const mergedRestaurants = [...(data.restaurants || []), ...ownerRestaurants]
      const ownerFoods = ownerRestaurants.flatMap(r => r.dishes || [])
      const mergedFoods = [...(data.foods || []), ...ownerFoods]

      setCatalog({ 
        ...EMPTY_CATALOG, 
        ...data, 
        restaurants: mergedRestaurants, 
        foods: mergedFoods 
      })
    } catch (err) {
      setError(err.message || 'Unable to load catalog')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      try {
        const data = await apiRequest('/catalog')
        
        const localOwnerData = localStorage.getItem('cravedrop_owner_restaurants')
        const ownerRestaurants = localOwnerData ? JSON.parse(localOwnerData) : []
        
        const mergedRestaurants = [...(data.restaurants || []), ...ownerRestaurants]
        const ownerFoods = ownerRestaurants.flatMap(r => r.dishes || [])
        const mergedFoods = [...(data.foods || []), ...ownerFoods]

        if (isMounted) {
          setCatalog({ 
            ...EMPTY_CATALOG, 
            ...data, 
            restaurants: mergedRestaurants, 
            foods: mergedFoods 
          })
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Unable to load catalog')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(() => ({
    ...catalog,
    isLoading,
    error,
    refreshCatalog
  }), [catalog, error, isLoading, refreshCatalog])

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) throw new Error('useCatalog must be used within CatalogProvider')
  return context
}
