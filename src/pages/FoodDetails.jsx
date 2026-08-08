import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus, FaLeaf, FaFire } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext.jsx'
import { useFavorites } from '../contexts/FavoritesContext.jsx'
import { useRestaurantOwner } from '../contexts/RestaurantContext.jsx'
import { useCatalog } from '../contexts/CatalogContext.jsx'
import FoodCustomizer from '../components/FoodCustomizer.jsx'
import NutritionPanel from '../components/NutritionPanel.jsx'
import FoodCard from '../components/FoodCard.jsx'

export default function FoodDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cartItems, addToCart, updateQuantity } = useCart()
  const { isFavoriteFood, toggleFavoriteFood } = useFavorites()
  const { ownerRestaurants } = useRestaurantOwner()
  const { foods, restaurants } = useCatalog()
  const [showCustomizer, setShowCustomizer] = React.useState(false)

  // Find food
  const allFoods = [...foods, ...ownerRestaurants.flatMap(r => r.dishes || [])]
  const food = allFoods.find(f => f.id === id)

  if (!food) {
    return (
      <div className="page-container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Food item not found</h1>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    )
  }

  // Find restaurant
  const allRestaurants = [...restaurants, ...ownerRestaurants]
  const restaurant = allRestaurants.find(r => r.id === food.restaurantId)

  // Cart logic
  const cartItem = cartItems.find(item => item.id === food.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    if (food.customizable) setShowCustomizer(true)
    else addToCart(food)
  }

  const isSoldOut = food.availability === 'sold_out'
  const isFav = isFavoriteFood(food.id)

  // Related foods
  const relatedFoods = allFoods.filter(f => f.restaurantId === food.restaurantId && f.id !== food.id).slice(0, 4)

  return (
    <div className="page-container pb-12">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/restaurants" className="hover:text-primary-500">Restaurants</Link>
        {restaurant && (
          <>
            <span className="mx-2">›</span>
            <Link to={`/restaurant/${restaurant.id}`} className="hover:text-primary-500 line-clamp-1 inline-block align-bottom max-w-[150px]">{restaurant.name}</Link>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-dark-900 dark:text-white">{food.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
          <FaArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Column */}
          <div className="relative">
            <div className={`aspect-square sm:aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-dark-700 ${isSoldOut ? 'grayscale' : ''}`}>
              <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {food.isVeg && <span className="bg-green-500 text-white p-2 rounded-xl shadow-lg"><FaLeaf /></span>}
              {food.tags?.includes('Bestseller') && <span className="bg-primary-500 text-white font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1 text-sm"><FaFire /> Hot</span>}
            </div>

            <button
              onClick={() => toggleFavoriteFood(food.id)}
              className={`absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg backdrop-blur-md transition-all hover:scale-110 ${isFav ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-dark-900/80 text-gray-400 hover:text-red-500'}`}
            >
              <FaHeart />
            </button>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <div>
              {isSoldOut && <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-3 py-1 rounded-lg text-xs mb-3">Sold Out</span>}
              {food.availability === 'limited' && <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-3 py-1 rounded-lg text-xs mb-3">Only {food.stockLeft} left!</span>}
              
              <h1 className="text-3xl md:text-4xl font-black text-dark-900 dark:text-white leading-tight">{food.name}</h1>
              {restaurant && (
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  From <Link to={`/restaurant/${restaurant.id}`} className="text-primary-500 hover:underline">{restaurant.name}</Link>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-dark-700 pb-6">
              <span className="text-3xl font-black text-primary-500">₹{food.price.toFixed(2)}</span>
              <div className="h-8 w-px bg-gray-200 dark:bg-dark-700" />
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-3 py-1.5 rounded-xl font-bold text-sm">
                <FaStar className="text-yellow-500" /> {food.rating || 'New'}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
              {food.description}
            </p>

            {/* Add to Cart Area */}
            <div className="pt-4">
              {isSoldOut ? (
                <button disabled className="w-full py-4 rounded-2xl bg-gray-200 dark:bg-dark-700 text-gray-500 dark:text-gray-400 font-bold text-lg cursor-not-allowed">
                  Currently Unavailable
                </button>
              ) : quantity === 0 ? (
                <button onClick={handleAdd} className="btn-primary w-full justify-center py-4 text-lg">
                  <FaShoppingBag /> {food.customizable ? 'Customize & Add' : 'Add to Cart'}
                </button>
              ) : (
                <div className="flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-2 border border-primary-200 dark:border-primary-800">
                  <button onClick={() => updateQuantity(food.id, quantity - 1)} className="w-12 h-12 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-colors shadow-sm text-xl">
                    <FaMinus />
                  </button>
                  <span className="font-black text-xl text-primary-600 dark:text-primary-400">{quantity}</span>
                  <button onClick={() => updateQuantity(food.id, quantity + 1)} className="w-12 h-12 bg-white dark:bg-dark-800 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-colors shadow-sm text-xl">
                    <FaPlus />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8">
              <NutritionPanel food={food} />
            </div>
          </div>
        </div>

        {/* Related Foods */}
        {relatedFoods.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6">More from {restaurant?.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedFoods.map(f => <FoodCard key={f.id} food={f} showAddButton={true} />)}
            </div>
          </div>
        )}
      </div>

      {showCustomizer && (
        <FoodCustomizer food={food} onConfirm={addToCart} onClose={() => setShowCustomizer(false)} />
      )}
    </div>
  )
}
