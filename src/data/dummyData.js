export const categories = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'burger', name: 'Burgers', icon: '🍔' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
  { id: 'chinese', name: 'Chinese', icon: '🥡' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'italian', name: 'Italian', icon: '🍝' },
]

export const restaurants = [
  {
    id: '1',
    name: 'Burger Kingpin',
    cuisine: 'American • Burgers • Fast Food',
    rating: 4.5,
    reviewCount: 2340,
    deliveryTime: '25–35 min',
    deliveryFee: 2.99,
    minOrder: 12.00,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    badge: 'Popular',
    category: 'burger'
  },
  {
    id: '2',
    name: 'Pizza Palace',
    cuisine: 'Italian • Pizza • Pasta',
    rating: 4.7,
    reviewCount: 1890,
    deliveryTime: '30–45 min',
    deliveryFee: 1.99,
    minOrder: 15.00,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop',
    badge: 'Top Rated',
    category: 'pizza'
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    cuisine: 'Japanese • Sushi • Asian',
    rating: 4.8,
    reviewCount: 980,
    deliveryTime: '35–50 min',
    deliveryFee: 3.49,
    minOrder: 20.00,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    badge: 'Premium',
    category: 'sushi'
  },
  {
    id: '4',
    name: 'Spice Route',
    cuisine: 'Indian • Curry • Tandoori',
    rating: 4.3,
    reviewCount: 1560,
    deliveryTime: '30–40 min',
    deliveryFee: 0.00,
    minOrder: 18.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    badge: 'Free Delivery',
    category: 'indian'
  },
  {
    id: '5',
    name: 'Green Bowl Co.',
    cuisine: 'Healthy • Salads • Bowls',
    rating: 4.6,
    reviewCount: 750,
    deliveryTime: '20–30 min',
    deliveryFee: 1.49,
    minOrder: 10.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    badge: 'Healthy',
    category: 'healthy'
  },
  {
    id: '6',
    name: 'Dragon Wok',
    cuisine: 'Chinese • Noodles • Dim Sum',
    rating: 4.4,
    reviewCount: 1120,
    deliveryTime: '25–40 min',
    deliveryFee: 2.49,
    minOrder: 14.00,
    image: 'https://images.unsplash.com/photo-1525755662778-95d057db2fa3?w=600&h=400&fit=crop',
    badge: null,
    category: 'chinese'
  },
  {
    id: '7',
    name: 'Taco Fiesta',
    cuisine: 'Mexican • Tacos • Burritos',
    rating: 4.2,
    reviewCount: 890,
    deliveryTime: '20–35 min',
    deliveryFee: 1.99,
    minOrder: 12.00,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop',
    badge: 'Spicy',
    category: 'mexican'
  },
  {
    id: '8',
    name: 'Sweet Tooth',
    cuisine: 'Desserts • Ice Cream • Bakery',
    rating: 4.9,
    reviewCount: 2100,
    deliveryTime: '15–25 min',
    deliveryFee: 2.99,
    minOrder: 8.00,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop',
    badge: 'Sweet',
    category: 'dessert'
  }
]

export const foods = [
  {
    id: 'f1',
    restaurantId: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, fresh lettuce, tomato, and our signature sauce on a toasted brioche bun.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    category: 'burger',
    rating: 4.6,
    calories: 650,
    isVeg: false,
    tags: ['Bestseller']
  },
  {
    id: 'f2',
    restaurantId: '1',
    name: 'Bacon Deluxe Burger',
    description: 'Double patty, crispy bacon, caramelized onions, and smoky BBQ sauce.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=400&fit=crop',
    category: 'burger',
    rating: 4.8,
    calories: 920,
    isVeg: false,
    tags: ['Popular']
  },
  {
    id: 'f3',
    restaurantId: '2',
    name: 'Margherita Pizza',
    description: 'San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil on hand-tossed dough.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop',
    category: 'pizza',
    rating: 4.5,
    calories: 780,
    isVeg: true,
    tags: ['Classic']
  },
  {
    id: 'f4',
    restaurantId: '2',
    name: 'Pepperoni Feast',
    description: 'Loaded with premium pepperoni, mozzarella, and our secret herb blend.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop',
    category: 'pizza',
    rating: 4.7,
    calories: 950,
    isVeg: false,
    tags: ['Bestseller']
  },
  {
    id: 'f5',
    restaurantId: '3',
    name: 'Dragon Roll',
    description: 'Shrimp tempura and cucumber inside, topped with avocado, eel sauce, and spicy mayo.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=400&fit=crop',
    category: 'sushi',
    rating: 4.9,
    calories: 420,
    isVeg: false,
    tags: ['Chef Special']
  },
  {
    id: 'f6',
    restaurantId: '3',
    name: 'Salmon Nigiri Set',
    description: 'Fresh Norwegian salmon over seasoned sushi rice. Served with miso soup.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&h=400&fit=crop',
    category: 'sushi',
    rating: 4.8,
    calories: 380,
    isVeg: false,
    tags: ['Fresh']
  },
  {
    id: 'f7',
    restaurantId: '4',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich, creamy tomato sauce with butter and aromatic spices.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop',
    category: 'indian',
    rating: 4.7,
    calories: 580,
    isVeg: false,
    tags: ['Bestseller']
  },
  {
    id: 'f8',
    restaurantId: '4',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese cubes in spiced gravy with bell peppers and onions.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop',
    category: 'indian',
    rating: 4.5,
    calories: 520,
    isVeg: true,
    tags: ['Vegetarian']
  },
  {
    id: 'f9',
    restaurantId: '5',
    name: 'Quinoa Power Bowl',
    description: 'Quinoa, roasted sweet potato, avocado, chickpeas, kale, and tahini dressing.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
    category: 'healthy',
    rating: 4.6,
    calories: 420,
    isVeg: true,
    tags: ['Vegan']
  },
  {
    id: 'f10',
    restaurantId: '5',
    name: 'Grilled Chicken Caesar',
    description: 'Romaine lettuce, parmesan, croutons, and grilled chicken with classic Caesar dressing.',
    price: 13.49,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=400&fit=crop',
    category: 'healthy',
    rating: 4.4,
    calories: 480,
    isVeg: false,
    tags: ['Protein Rich']
  },
  {
    id: 'f11',
    restaurantId: '6',
    name: 'Kung Pao Chicken',
    description: 'Stir-fried chicken with peanuts, vegetables, and chili peppers in a savory sauce.',
    price: 12.49,
    image: 'https://images.unsplash.com/photo-1525755662778-95d057db2fa3?w=500&h=400&fit=crop',
    category: 'chinese',
    rating: 4.3,
    calories: 550,
    isVeg: false,
    tags: ['Spicy']
  },
  {
    id: 'f12',
    restaurantId: '6',
    name: 'Vegetable Dim Sum',
    description: 'Steamed dumplings filled with mushroom, cabbage, and glass noodles.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&h=400&fit=crop',
    category: 'chinese',
    rating: 4.5,
    calories: 320,
    isVeg: true,
    tags: ['Steamed']
  },
  {
    id: 'f13',
    restaurantId: '7',
    name: 'Carne Asada Tacos',
    description: 'Grilled steak tacos with cilantro, onion, and salsa verde on corn tortillas.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=400&fit=crop',
    category: 'mexican',
    rating: 4.6,
    calories: 480,
    isVeg: false,
    tags: ['Authentic']
  },
  {
    id: 'f14',
    restaurantId: '7',
    name: 'Guacamole & Chips',
    description: 'Freshly made guacamole with lime, cilantro, and crispy tortilla chips.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1613514785819-5d32bbfa814b?w=500&h=400&fit=crop',
    category: 'mexican',
    rating: 4.4,
    calories: 380,
    isVeg: true,
    tags: ['Snack']
  },
  {
    id: 'f15',
    restaurantId: '8',
    name: 'Molten Lava Cake',
    description: 'Warm chocolate cake with a gooey center, served with vanilla ice cream.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&h=400&fit=crop',
    category: 'dessert',
    rating: 4.9,
    calories: 620,
    isVeg: true,
    tags: ['Must Try']
  },
  {
    id: 'f16',
    restaurantId: '8',
    name: 'Berry Cheesecake',
    description: 'Creamy New York style cheesecake topped with fresh mixed berries.',
    price: 9.49,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=400&fit=crop',
    category: 'dessert',
    rating: 4.7,
    calories: 540,
    isVeg: true,
    tags: ['Creamy']
  }
]

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'CraveDrop has completely changed how I order food. The delivery is always on time and the app is so easy to use!'
  },
  {
    id: 2,
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Best food delivery app I have ever used. The variety of restaurants is incredible and the tracking feature is spot on.'
  },
  {
    id: 3,
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    text: 'Love the exclusive deals and discounts. I have saved so much money while enjoying my favorite meals from top restaurants.'
  },
  {
    id: 4,
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The customer service is outstanding. Had an issue once and it was resolved within minutes. Highly recommended!'
  }
]

export const offers = [
  {
    id: 1,
    title: '50% OFF First Order',
    subtitle: 'Use code: WELCOME50',
    color: 'bg-gradient-to-r from-primary-500 to-primary-600',
    textColor: 'text-white'
  },
  {
    id: 2,
    title: 'Free Delivery Weekend',
    subtitle: 'On orders above $25',
    color: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
    textColor: 'text-white'
  },
  {
    id: 3,
    title: 'Buy 1 Get 1 Free',
    subtitle: 'Selected desserts only',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    textColor: 'text-white'
  }
]