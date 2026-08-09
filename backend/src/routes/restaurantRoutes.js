import { Router } from 'express'
import { query } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET all restaurants with their dishes (public)
router.get('/', async (req, res, next) => {
  try {
    const { rows: restaurants } = await query(
      `SELECT * FROM restaurants ORDER BY created_at DESC`
    )
    // Fetch dishes for all restaurants
    const { rows: dishes } = await query(
      `SELECT * FROM dishes ORDER BY created_at ASC`
    )
    // Map dishes to restaurants
    const result = restaurants.map(r => ({
      id: r.id,
      ownerId: r.owner_id,
      name: r.name,
      description: r.description,
      cuisine: r.cuisine,
      deliveryTime: r.delivery_time,
      deliveryFee: parseFloat(r.delivery_fee) || 0,
      minOrder: parseFloat(r.min_order) || 0,
      image: r.image,
      phone: r.phone,
      address: r.address,
      category: r.category,
      badge: r.badge,
      rating: parseFloat(r.rating) || 0,
      reviewCount: r.review_count || 0,
      isOpen: r.is_open,
      isOwnerCreated: true,
      dishes: dishes
        .filter(d => d.restaurant_id === r.id)
        .map(d => ({
          id: d.id,
          restaurantId: d.restaurant_id,
          name: d.name,
          description: d.description,
          price: parseFloat(d.price) || 0,
          image: d.image,
          category: d.category,
          isVeg: d.is_veg,
          calories: d.calories || 0,
          rating: parseFloat(d.rating) || 0,
          isOwnerCreated: true,
        }))
    }))
    res.json({ restaurants: result })
  } catch (error) {
    next(error)
  }
})

// GET owner's restaurant (auth required)
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.sub || req.user.id
    const { rows: restaurants } = await query(
      `SELECT * FROM restaurants WHERE owner_id = $1`, [ownerId]
    )
    if (restaurants.length === 0) return res.json({ restaurant: null })
    const restaurant = restaurants[0]
    const { rows: dishes } = await query(
      `SELECT * FROM dishes WHERE restaurant_id = $1 ORDER BY created_at ASC`, [restaurant.id]
    )
    res.json({
      restaurant: {
        id: restaurant.id,
        ownerId: restaurant.owner_id,
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine,
        deliveryTime: restaurant.delivery_time,
        deliveryFee: parseFloat(restaurant.delivery_fee) || 0,
        minOrder: parseFloat(restaurant.min_order) || 0,
        image: restaurant.image,
        phone: restaurant.phone,
        address: restaurant.address,
        category: restaurant.category,
        badge: restaurant.badge,
        rating: parseFloat(restaurant.rating) || 0,
        reviewCount: restaurant.review_count || 0,
        isOpen: restaurant.is_open,
        isOwnerCreated: true,
        dishes: dishes.map(d => ({
          id: d.id,
          restaurantId: d.restaurant_id,
          name: d.name,
          description: d.description,
          price: parseFloat(d.price) || 0,
          image: d.image,
          category: d.category,
          isVeg: d.is_veg,
          calories: d.calories || 0,
          rating: parseFloat(d.rating) || 0,
          isOwnerCreated: true,
        }))
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST create restaurant (auth required, owner only)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only owners can create restaurants' })
    }
    const ownerId = req.user.sub || req.user.id
    const { name, description, cuisine, deliveryTime, deliveryFee, minOrder, image, phone, address, category } = req.body
    const { rows } = await query(
      `INSERT INTO restaurants (owner_id, name, description, cuisine, delivery_time, delivery_fee, min_order, image, phone, address, category, badge, rating, review_count, is_open)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'New',0,0,true)
       RETURNING *`,
      [ownerId, name, description || '', cuisine || 'Multi-Cuisine', deliveryTime || '30-45 min',
       parseFloat(deliveryFee) || 0, parseFloat(minOrder) || 0, image || '', phone || '', address || '', category || 'other']
    )
    res.status(201).json({ id: rows[0].id })
  } catch (error) {
    next(error)
  }
})

// PUT update restaurant (auth required)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.sub || req.user.id
    const { name, description, cuisine, deliveryTime, deliveryFee, minOrder, image, phone, address, category } = req.body
    const { rowCount } = await query(
      `UPDATE restaurants SET name=$1, description=$2, cuisine=$3, delivery_time=$4, delivery_fee=$5, min_order=$6, image=$7, phone=$8, address=$9, category=$10
       WHERE id=$11 AND owner_id=$12`,
      [name, description, cuisine, deliveryTime, parseFloat(deliveryFee) || 0, parseFloat(minOrder) || 0, image, phone, address, category, req.params.id, ownerId]
    )
    if (rowCount === 0) return res.status(404).json({ message: 'Restaurant not found or not authorized' })
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// POST add dish (auth required)
router.post('/:id/dishes', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.sub || req.user.id
    // Verify ownership
    const { rows } = await query(`SELECT id FROM restaurants WHERE id=$1 AND owner_id=$2`, [req.params.id, ownerId])
    if (rows.length === 0) return res.status(403).json({ message: 'Not authorized' })
    const { name, description, price, image, category, isVeg, calories } = req.body
    const { rows: dish } = await query(
      `INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_veg, calories, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0) RETURNING *`,
      [req.params.id, name, description || '', parseFloat(price) || 0, image || '', category || 'other', isVeg || false, parseInt(calories) || 0]
    )
    res.status(201).json({ id: dish[0].id })
  } catch (error) {
    next(error)
  }
})

// PUT update dish (auth required)
router.put('/:id/dishes/:dishId', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.sub || req.user.id
    const { rows } = await query(`SELECT id FROM restaurants WHERE id=$1 AND owner_id=$2`, [req.params.id, ownerId])
    if (rows.length === 0) return res.status(403).json({ message: 'Not authorized' })
    const { name, description, price, image, category, isVeg, calories } = req.body
    await query(
      `UPDATE dishes SET name=$1, description=$2, price=$3, image=$4, category=$5, is_veg=$6, calories=$7 WHERE id=$8 AND restaurant_id=$9`,
      [name, description, parseFloat(price) || 0, image, category, isVeg || false, parseInt(calories) || 0, req.params.dishId, req.params.id]
    )
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// DELETE dish (auth required)
router.delete('/:id/dishes/:dishId', requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.sub || req.user.id
    const { rows } = await query(`SELECT id FROM restaurants WHERE id=$1 AND owner_id=$2`, [req.params.id, ownerId])
    if (rows.length === 0) return res.status(403).json({ message: 'Not authorized' })
    await query(`DELETE FROM dishes WHERE id=$1 AND restaurant_id=$2`, [req.params.dishId, req.params.id])
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

export default router
