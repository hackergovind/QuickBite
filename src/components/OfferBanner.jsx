import React from 'react'
import { FaArrowRight, FaTag } from 'react-icons/fa'

export default function OfferBanner({ offer }) {
  return (
    <div className={`${offer.color} rounded-2xl p-6 sm:p-8 relative overflow-hidden group cursor-pointer transform hover:scale-[1.02] transition-transform duration-300`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <FaTag className="text-white/80" />
          <span className="text-white/80 text-sm font-medium">Limited Offer</span>
        </div>
        <h3 className={`text-2xl sm:text-3xl font-bold ${offer.textColor} mb-2`}>
          {offer.title}
        </h3>
        <p className={`${offer.textColor} opacity-90 mb-4`}>{offer.subtitle}</p>
        <button className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 group/btn">
          Claim Now <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}