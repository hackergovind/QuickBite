export const categories = [
  { id: 'all', name: 'All', icon: 'All' },
  { id: 'burger', name: 'Burgers', icon: 'Bg' },
  { id: 'pizza', name: 'Pizza', icon: 'Pz' },
  { id: 'indian', name: 'Indian', icon: 'In' },
  { id: 'healthy', name: 'Healthy', icon: 'Hy' },
  { id: 'dessert', name: 'Desserts', icon: 'Ds' },
  { id: 'chinese', name: 'Chinese', icon: 'Ch' }
]

export const moodCategories = [
  { id: 'comfort', label: 'Comfort Food', emoji: 'Co', color: 'from-orange-400 to-red-400', foodCategories: ['indian', 'chinese'] },
  { id: 'healthy', label: 'Healthy', emoji: 'He', color: 'from-green-400 to-emerald-500', foodCategories: ['healthy'] },
  { id: 'party', label: 'Party Vibes', emoji: 'Pa', color: 'from-purple-400 to-pink-500', foodCategories: ['pizza', 'burger'] },
  { id: 'dessert', label: 'Sweet Tooth', emoji: 'Sw', color: 'from-yellow-400 to-orange-400', foodCategories: ['dessert'] }
]

const foods = [
  {
    id: 'butter-chicken-bowl',
    restaurantId: 'spice-street',
    name: 'Butter Chicken Bowl',
    category: 'indian',
    price: 249,
    calories: 620,
    rating: 4.8,
    isVeg: false,
    customizable: true,
    availability: 'available',
    tags: ['Bestseller'],
    description: 'Creamy butter chicken served with jeera rice, salad, and mint chutney.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&auto=format&fit=crop'
  },
  {
    id: 'paneer-tikka-wrap',
    restaurantId: 'spice-street',
    name: 'Paneer Tikka Wrap',
    category: 'indian',
    price: 179,
    calories: 480,
    rating: 4.6,
    isVeg: true,
    customizable: true,
    availability: 'limited',
    stockLeft: 8,
    tags: ['Bestseller'],
    description: 'Smoky paneer tikka, crunchy onions, and house sauce wrapped in a soft paratha.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&auto=format&fit=crop'
  },
  {
    id: 'classic-cheese-burger',
    restaurantId: 'burger-yard',
    name: 'Classic Cheese Burger',
    category: 'burger',
    price: 199,
    calories: 710,
    rating: 4.7,
    isVeg: false,
    customizable: true,
    availability: 'available',
    tags: ['Bestseller'],
    description: 'Juicy grilled patty with cheddar, lettuce, tomato, pickles, and signature sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop'
  },
  {
    id: 'veg-crunch-burger',
    restaurantId: 'burger-yard',
    name: 'Veg Crunch Burger',
    category: 'burger',
    price: 159,
    calories: 540,
    rating: 4.4,
    isVeg: true,
    customizable: false,
    availability: 'available',
    tags: [],
    description: 'Crispy vegetable patty layered with cheese, lettuce, and tangy mayo.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&auto=format&fit=crop'
  },
  {
    id: 'margherita-pizza',
    restaurantId: 'slice-house',
    name: 'Margherita Pizza',
    category: 'pizza',
    price: 299,
    calories: 820,
    rating: 4.5,
    isVeg: true,
    customizable: true,
    availability: 'available',
    tags: ['Bestseller'],
    description: 'Stone-baked pizza with mozzarella, basil, and San Marzano style tomato sauce.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&auto=format&fit=crop'
  },
  {
    id: 'pepperoni-feast',
    restaurantId: 'slice-house',
    name: 'Pepperoni Feast',
    category: 'pizza',
    price: 379,
    calories: 940,
    rating: 4.7,
    isVeg: false,
    customizable: true,
    availability: 'available',
    tags: [],
    description: 'Loaded pepperoni pizza with extra cheese and chilli oil on the side.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&auto=format&fit=crop'
  },
  {
    id: 'protein-power-bowl',
    restaurantId: 'green-bowl',
    name: 'Protein Power Bowl',
    category: 'healthy',
    price: 229,
    calories: 430,
    rating: 4.6,
    isVeg: true,
    customizable: true,
    availability: 'available',
    tags: ['Bestseller'],
    description: 'Quinoa, chickpeas, grilled paneer, greens, seeds, and lemon tahini dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop'
  },
  {
    id: 'hakka-noodles',
    restaurantId: 'wok-wave',
    name: 'Hakka Noodles',
    category: 'chinese',
    price: 169,
    calories: 560,
    rating: 4.3,
    isVeg: true,
    customizable: false,
    availability: 'available',
    tags: [],
    description: 'Street-style noodles tossed with vegetables, soy, chilli, and spring onion.',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900&auto=format&fit=crop'
  },
  {
    id: 'chocolate-brownie',
    restaurantId: 'sweet-stop',
    name: 'Chocolate Brownie',
    category: 'dessert',
    price: 129,
    calories: 390,
    rating: 4.8,
    isVeg: true,
    customizable: false,
    availability: 'available',
    tags: ['Bestseller'],
    description: 'Dense chocolate brownie with fudge sauce and roasted walnuts.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop'
  }
]

const restaurants = [
  {
    id: 'spice-street',
    name: 'Spice Street',
    cuisine: 'Indian, North Indian',
    rating: 4.8,
    reviews: 1240,
    deliveryTime: '25-35 min',
    deliveryFee: 0,
    isOpen: true,
    badge: 'Popular',
    tags: ['indian', 'comfort'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&auto=format&fit=crop'
    ]
  },
  {
    id: 'burger-yard',
    name: 'Burger Yard',
    cuisine: 'Burgers, Fast Food',
    rating: 4.6,
    reviews: 890,
    deliveryTime: '20-30 min',
    deliveryFee: 29,
    isOpen: true,
    badge: 'Fast',
    tags: ['burger'],
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=900&auto=format&fit=crop'
    ]
  },
  {
    id: 'slice-house',
    name: 'Slice House',
    cuisine: 'Pizza, Italian',
    rating: 4.7,
    reviews: 1030,
    deliveryTime: '30-40 min',
    deliveryFee: 39,
    isOpen: true,
    badge: 'Trending',
    tags: ['pizza', 'italian'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&auto=format&fit=crop'
    ]
  },
  {
    id: 'green-bowl',
    name: 'Green Bowl',
    cuisine: 'Healthy, Salads',
    rating: 4.5,
    reviews: 520,
    deliveryTime: '20-25 min',
    deliveryFee: 0,
    isOpen: true,
    badge: 'Healthy',
    tags: ['healthy'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop'
    ]
  },
  {
    id: 'wok-wave',
    name: 'Wok Wave',
    cuisine: 'Chinese, Asian',
    rating: 4.3,
    reviews: 460,
    deliveryTime: '35-45 min',
    deliveryFee: 35,
    isOpen: true,
    badge: '',
    tags: ['chinese'],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900&auto=format&fit=crop'
    ]
  },
  {
    id: 'sweet-stop',
    name: 'Sweet Stop',
    cuisine: 'Desserts, Bakery',
    rating: 4.8,
    reviews: 760,
    deliveryTime: '15-25 min',
    deliveryFee: 19,
    isOpen: true,
    badge: 'Sweet Deal',
    tags: ['dessert'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop'
    ]
  }
]

export const offers = [
  {
    id: 'weekend-feast',
    title: 'Weekend Feast',
    subtitle: 'Get 20% off on orders above Rs. 499',
    code: 'QUICK20',
    discount: 20
  }
]

export const coupons = [
  { code: 'QUICK20', label: '20% off', description: '20% off on orders above Rs. 499', discountType: 'percent', value: 20, minOrder: 499 },
  { code: 'FREESHIP', label: 'Free delivery', description: 'Free delivery on orders above Rs. 199', discountType: 'delivery', value: 0, minOrder: 199 },
  { code: 'WELCOME100', label: 'Rs. 100 off', description: 'Rs. 100 off on your first large order', discountType: 'flat', value: 100, minOrder: 399 }
]

export const deliveryPartners = [
  {
    id: 'rider-1',
    name: 'Aman Verma',
    vehicle: 'Electric scooter',
    phone: '+911234567890',
    rating: 4.9,
    deliveries: 1240,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop'
  },
  {
    id: 'rider-2',
    name: 'Priya Sharma',
    vehicle: 'Bike',
    phone: '+919876543210',
    rating: 4.8,
    deliveries: 980,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop'
  }
]

export const testimonials = [
  { id: 't1', name: 'Neha', comment: 'Quick delivery and fresh food every time.', rating: 5 },
  { id: 't2', name: 'Rohan', comment: 'The checkout flow is smooth and reliable.', rating: 5 }
]

export const mockReviews = []

export function getCatalog() {
  const foodsByRestaurant = foods.reduce((acc, food) => {
    acc[food.restaurantId] ??= []
    acc[food.restaurantId].push(food)
    return acc
  }, {})

  const restaurantsWithDishes = restaurants.map((restaurant) => ({
    ...restaurant,
    dishes: foodsByRestaurant[restaurant.id] || []
  }))

  return {
    categories,
    moodCategories,
    coupons,
    deliveryPartners,
    mockReviews,
    restaurants: restaurantsWithDishes,
    foods,
    testimonials,
    offers
  }
}
