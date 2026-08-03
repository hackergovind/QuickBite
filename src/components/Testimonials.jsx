import React from 'react'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { testimonials } from '../data/dummyData.js'

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Real reviews from real food lovers who use CraveDrop every day.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card p-6 hover:shadow-card-hover transition-all duration-300 group">
              <FaQuoteLeft className="text-primary-200 text-3xl mb-4 group-hover:text-primary-400 transition-colors" />
              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4">"{t.text}"</p>

              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100" />
                <div>
                  <p className="font-semibold text-dark-900 text-sm">{t.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${i < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}