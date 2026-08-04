import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Restaurants from './pages/Restaurants.jsx'
import RestaurantDetails from './pages/RestaurantDetails.jsx'
import FoodDetails from './pages/FoodDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute, { OwnerRoute } from './components/ProtectedRoute.jsx'
import { RestaurantProvider } from './contexts/RestaurantContext.jsx'
import { OrdersProvider } from './contexts/OrdersContext.jsx'
import { ReviewsProvider } from './contexts/ReviewsContext.jsx'

// Layout wrapper — hides Navbar/Footer on owner dashboard
function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ReviewsProvider>
      <OrdersProvider>
        <RestaurantProvider>
        <Routes>
          {/* Owner Dashboard — full-screen, no navbar/footer */}
          <Route
            path="/owner-dashboard"
            element={
              <OwnerRoute>
                <OwnerDashboard />
              </OwnerRoute>
            }
          />

          {/* All customer-facing routes */}
          <Route
            path="/*"
            element={
              <CustomerLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                  <Route path="/food/:id" element={<FoodDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute><Checkout /></ProtectedRoute>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CustomerLayout>
            }
          />
        </Routes>
        </RestaurantProvider>
      </OrdersProvider>
    </ReviewsProvider>
  )
}