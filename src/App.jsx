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
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import RiderDashboard from './pages/RiderDashboard.jsx'
import Wallet from './pages/Wallet.jsx'
import Notifications from './pages/Notifications.jsx'
import ProtectedRoute, { OwnerRoute, AdminRoute } from './components/ProtectedRoute.jsx'
import { RestaurantProvider } from './contexts/RestaurantContext.jsx'
import { OrdersProvider } from './contexts/OrdersContext.jsx'
import { ReviewsProvider } from './contexts/ReviewsContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'
import { NotificationsProvider } from './contexts/NotificationsContext.jsx'
import { WalletProvider } from './contexts/WalletContext.jsx'
import { AdminProvider } from './contexts/AdminContext.jsx'

function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <ThemeProvider>
        <NotificationsProvider>
          <WalletProvider>
            <FavoritesProvider>
              <ReviewsProvider>
                <OrdersProvider>
                  <RestaurantProvider>
                    <Routes>
                      {/* Admin Panel — full-screen, no navbar/footer */}
                      <Route
                        path="/admin/*"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />

                      {/* Owner Dashboard — full-screen, no navbar/footer */}
                      <Route
                        path="/owner-dashboard"
                        element={
                          <OwnerRoute>
                            <OwnerDashboard />
                          </OwnerRoute>
                        }
                      />

                      {/* Rider Dashboard */}
                      <Route
                        path="/rider-dashboard"
                        element={
                          <ProtectedRoute>
                            <RiderDashboard />
                          </ProtectedRoute>
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
                              <Route path="/order/:id" element={
                                <ProtectedRoute><OrderTracking /></ProtectedRoute>
                              } />
                              <Route path="/login" element={<Login />} />
                              <Route path="/signup" element={<Signup />} />
                              <Route path="/profile" element={
                                <ProtectedRoute><Profile /></ProtectedRoute>
                              } />
                              <Route path="/wallet" element={
                                <ProtectedRoute><Wallet /></ProtectedRoute>
                              } />
                              <Route path="/notifications" element={
                                <ProtectedRoute><Notifications /></ProtectedRoute>
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
            </FavoritesProvider>
          </WalletProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </AdminProvider>
  )
}