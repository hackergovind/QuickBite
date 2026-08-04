import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const OrdersContext = createContext(null)

const ORDERS_KEY = 'quickbite_orders'

function loadOrders() {
  try {
    const data = localStorage.getItem(ORDERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export const ORDER_STATUS = {
  PENDING:    'pending',
  CONFIRMED:  'confirmed',
  PREPARING:  'preparing',
  OUT:        'out_for_delivery',
  DELIVERED:  'delivered',
  CANCELLED:  'cancelled',
}

export const STATUS_LABEL = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
}

export const STATUS_COLOR = {
  pending:          'bg-amber-100 text-amber-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  useEffect(() => {
    saveOrders(orders)
  }, [orders])

  /** Place a new order (called from Checkout) */
  const placeOrder = useCallback(({ cartItems, totalAmount, deliveryFee, tax, restaurantId, restaurantName, customerId, customerName, customerAddress }) => {
    const order = {
      id: `ord-${Date.now()}`,
      restaurantId,
      restaurantName,
      customerId,
      customerName,
      customerAddress: customerAddress || 'Not provided',
      items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal: totalAmount,
      deliveryFee,
      tax,
      total: totalAmount + deliveryFee + tax,
      status: ORDER_STATUS.PENDING,
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setOrders(prev => [order, ...prev])
    return order.id
  }, [])

  /** Update status of an order (called from owner dashboard) */
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    )
  }, [])

  /** Get all orders for a specific restaurant */
  const getOrdersByRestaurant = useCallback(
    (restaurantId) => orders.filter(o => o.restaurantId === restaurantId),
    [orders]
  )

  /** All orders (for admin / debugging) */
  const getAllOrders = useCallback(() => orders, [orders])

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateOrderStatus, getOrdersByRestaurant, getAllOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
