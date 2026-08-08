import { Router } from 'express'
import { getCatalog } from '../data/catalogData.js'
import { withJsonCache } from '../utils/cache.js'

const router = Router()

function sendCached(res, payload) {
  res.set('X-Cache', payload.cacheStatus)
  res.json(payload.data)
}

router.get('/', async (req, res, next) => {
  try {
    const payload = await withJsonCache('catalog:all', getCatalog)
    sendCached(res, payload)
  } catch (error) {
    next(error)
  }
})

router.get('/restaurants', async (req, res, next) => {
  try {
    const payload = await withJsonCache('catalog:restaurants', () => ({
      restaurants: getCatalog().restaurants
    }))
    sendCached(res, payload)
  } catch (error) {
    next(error)
  }
})

router.get('/restaurants/:id', async (req, res, next) => {
  try {
    const payload = await withJsonCache(`catalog:restaurants:${req.params.id}`, () => {
      const restaurant = getCatalog().restaurants.find((item) => item.id === req.params.id)
      return { restaurant: restaurant || null }
    })

    if (!payload.data.restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    sendCached(res, payload)
  } catch (error) {
    next(error)
  }
})

router.get('/foods', async (req, res, next) => {
  try {
    const payload = await withJsonCache('catalog:foods', () => ({
      foods: getCatalog().foods
    }))
    sendCached(res, payload)
  } catch (error) {
    next(error)
  }
})

router.get('/foods/:id', async (req, res, next) => {
  try {
    const payload = await withJsonCache(`catalog:foods:${req.params.id}`, () => {
      const catalog = getCatalog()
      const food = catalog.foods.find((item) => item.id === req.params.id)
      const restaurant = food
        ? catalog.restaurants.find((item) => item.id === food.restaurantId)
        : null

      return { food: food || null, restaurant: restaurant || null }
    })

    if (!payload.data.food) {
      return res.status(404).json({ message: 'Food item not found' })
    }

    sendCached(res, payload)
  } catch (error) {
    next(error)
  }
})

export default router
