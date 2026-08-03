import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaStar } from 'react-icons/fa'
import heroFoodLoop from '../assets/hero-food-loop.mp4'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-primary-100">
              <FaStar className="text-primary-500 text-sm" />
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ happy customers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 leading-tight text-balance">
              Delicious Food <br />
              <span className="text-primary-500">Delivered Fast</span> <br />
              To Your Door
            </h1>

            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Discover the best restaurants in your area and get your favorite meals delivered in minutes. Fresh, hot, and exactly how you like it.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2 text-lg">
                Order Now <FaArrowRight />
              </Link>
              <Link to="/restaurants" className="btn-outline inline-flex items-center gap-2 text-lg">
                Explore Menu
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-dark-900">500+</p>
                <p className="text-sm text-gray-500">Restaurants</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-dark-900">15k+</p>
                <p className="text-sm text-gray-500">Daily Orders</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-dark-900">4.9</p>
                <p className="text-sm text-gray-500">App Rating</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-fade-in">
              <video
                src={heroFoodLoop}
                aria-label="Delicious food"
                className="w-full max-w-[700px] aspect-[7/6] object-cover rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <p className="font-bold text-dark-900">Fast Delivery</p>
                    <p className="text-sm text-gray-500">Under 30 minutes</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <p className="font-bold text-dark-900">Top Rated</p>
                    <p className="text-sm text-gray-500">4.8+ average</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
