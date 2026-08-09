import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const ORDER_STATUSES = new Set([
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
])

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function mapOrder(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerAddress: row.customer_address || '',
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    restaurantOwnerId: row.restaurant_owner_id,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    tax: Number(row.tax),
    total: Number(row.total),
    paymentMethod: row.payment_method,
    status: row.status,
    placedAt: row.placed_at,
    updatedAt: row.updated_at,
    items: row.items || []
  }
}

function validateOrder(body) {
  if (!body.restaurantId?.trim()) return 'Restaurant id is required'
  if (!body.restaurantName?.trim()) return 'Restaurant name is required'
  if (!Array.isArray(body.items) || body.items.length === 0) return 'At least one order item is required'

  const invalidItem = body.items.find((item) => (
    !String(item.id || item.itemId || '').trim() ||
    !String(item.name || '').trim() ||
    toNumber(item.price) < 0 ||
    !Number.isInteger(Number(item.quantity)) ||
    Number(item.quantity) <= 0
  ))

  if (invalidItem) return 'Each item needs id, name, price, and quantity'
  return null
}

async function fetchOrder(client, orderId) {
  const { rows } = await client.query(
    `SELECT
       o.*,
       COALESCE(
         json_agg(
           json_build_object(
             'id', oi.item_id,
             'name', oi.name,
             'price', oi.price::float,
             'quantity', oi.quantity,
             'image', oi.image
           )
           ORDER BY oi.name
         ) FILTER (WHERE oi.id IS NOT NULL),
         '[]'
       ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1
     GROUP BY o.id`,
    [orderId]
  )

  return rows[0] ? mapOrder(rows[0]) : null
}

router.use(requireAuth)

router.post('/', async (req, res, next) => {
  const validationError = validateOrder(req.body)
  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const subtotal = toNumber(req.body.subtotal)
    const deliveryFee = toNumber(req.body.deliveryFee)
    const tax = toNumber(req.body.tax)
    const total = req.body.total === undefined ? subtotal + deliveryFee + tax : toNumber(req.body.total)

    const { rows } = await client.query(
      `INSERT INTO orders (
         customer_id,
         customer_name,
         customer_address,
         restaurant_id,
         restaurant_name,
         restaurant_owner_id,
         subtotal,
         delivery_fee,
         tax,
         total,
         payment_method
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        req.user.id,
        req.user.name,
        req.body.customerAddress || req.user.address || '',
        req.body.restaurantId.trim(),
        req.body.restaurantName.trim(),
        req.body.restaurantOwnerId || null,
        subtotal,
        deliveryFee,
        tax,
        total,
        req.body.paymentMethod || null
      ]
    )

    const orderId = rows[0].id

    for (const item of req.body.items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_id, name, price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          String(item.id || item.itemId).trim(),
          String(item.name).trim(),
          toNumber(item.price),
          Number(item.quantity),
          item.image || null
        ]
      )
    }

    const order = await fetchOrder(client, orderId)
    await client.query('COMMIT')

    res.status(201).json({ order })
  } catch (error) {
    await client.query('ROLLBACK')
    next(error)
  } finally {
    client.release()
  }
})

router.get('/mine', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         o.*,
         COALESCE(
           json_agg(
             json_build_object(
               'id', oi.item_id,
               'name', oi.name,
               'price', oi.price::float,
               'quantity', oi.quantity,
               'image', oi.image
             )
             ORDER BY oi.name
           ) FILTER (WHERE oi.id IS NOT NULL),
           '[]'
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.placed_at DESC`,
      [req.user.id]
    )

    res.json({ orders: rows.map(mapOrder) })
  } catch (error) {
    next(error)
  }
})

router.get('/owner', async (req, res, next) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only restaurant owners can view owner orders' })
  }

  try {
    const params = req.user.role === 'admin' ? [] : [req.user.id]
    const ownerFilter = req.user.role === 'admin' ? '' : 'WHERE o.restaurant_owner_id = $1'

    const { rows } = await pool.query(
      `SELECT
         o.*,
         COALESCE(
           json_agg(
             json_build_object(
               'id', oi.item_id,
               'name', oi.name,
               'price', oi.price::float,
               'quantity', oi.quantity,
               'image', oi.image
             )
             ORDER BY oi.name
           ) FILTER (WHERE oi.id IS NOT NULL),
           '[]'
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       ${ownerFilter}
       GROUP BY o.id
       ORDER BY o.placed_at DESC`,
      params
    )

    res.json({ orders: rows.map(mapOrder) })
  } catch (error) {
    next(error)
  }
})

router.get('/restaurant/:restaurantId', async (req, res, next) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only restaurant owners can view restaurant orders' })
  }

  try {
    const params = req.user.role === 'admin'
      ? [req.params.restaurantId]
      : [req.params.restaurantId, req.user.id]
    const ownerFilter = req.user.role === 'admin' ? '' : 'AND o.restaurant_owner_id = $2'

    const { rows } = await pool.query(
      `SELECT
         o.*,
         COALESCE(
           json_agg(
             json_build_object(
               'id', oi.item_id,
               'name', oi.name,
               'price', oi.price::float,
               'quantity', oi.quantity,
               'image', oi.image
             )
             ORDER BY oi.name
           ) FILTER (WHERE oi.id IS NOT NULL),
           '[]'
         ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.restaurant_id = $1 ${ownerFilter}
       GROUP BY o.id
       ORDER BY o.placed_at DESC`,
      params
    )

    res.json({ orders: rows.map(mapOrder) })
  } catch (error) {
    next(error)
  }
})

router.patch('/:orderId/status', async (req, res, next) => {
  if (!ORDER_STATUSES.has(req.body.status)) {
    return res.status(400).json({ message: 'Invalid order status' })
  }

  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only restaurant owners can update order status' })
  }

  try {
    const params = req.user.role === 'admin'
      ? [req.body.status, req.params.orderId]
      : [req.body.status, req.params.orderId, req.user.id]
    const ownerFilter = req.user.role === 'admin' ? '' : 'AND restaurant_owner_id = $3'

    const { rowCount } = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2 ${ownerFilter}`,
      params
    )

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const order = await fetchOrder(pool, req.params.orderId)
    res.json({ order })
  } catch (error) {
    next(error)
  }
})

export default router
