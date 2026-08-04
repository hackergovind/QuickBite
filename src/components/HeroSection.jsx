import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import heroFoodLoop from '../assets/hero-food-loop.mp4'

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center py-20 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src={heroFoodLoop}
          className="w-full h-full object-cover scale-105 animate-slow-pan"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight">
            Delicious Food <br />
            <span className="text-primary-400">Delivered Fast</span> <br />
            To Your Door
          </h1>

          <p className="text-lg text-gray-200 max-w-xl leading-relaxed">
            Discover the best restaurants in your area and get your favorite meals delivered in minutes. Fresh, hot, and exactly how you like it.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2 text-lg">
              Order Now <FaArrowRight />
            </Link>
            <Link to="/restaurants" className="px-6 py-3 rounded-xl border-2 border-white text-white hover:bg-white/10 font-bold inline-flex items-center gap-2 text-lg transition-all duration-300">
              Explore Menu
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-6 text-gray-300 text-sm font-medium">
            <span>Local restaurants</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <span>Fast delivery</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <span>Fresh meals</span>
          </div>
        </div>
      </div>
    </section>
  )
}
