import React from 'react'
import { Link } from 'react-router-dom'
import { FaWallet, FaStar, FaCoins, FaGift } from 'react-icons/fa'
import { useWallet } from '../contexts/WalletContext.jsx'

const TIER_CONFIG = {
  Bronze: { color: 'from-amber-600 to-amber-800', badge: '🥉', next: 'Silver', nextAt: 500 },
  Silver: { color: 'from-gray-400 to-gray-600', badge: '🥈', next: 'Gold', nextAt: 1000 },
  Gold:   { color: 'from-yellow-400 to-yellow-600', badge: '🥇', next: null, nextAt: null },
}

export default function WalletCard({ compact = false }) {
  const { balance, points, tier } = useWallet()
  const cfg = TIER_CONFIG[tier]
  const pct = cfg.nextAt ? Math.min((points / cfg.nextAt) * 100, 100) : 100

  if (compact) {
    return (
      <Link to="/wallet" className={`block bg-gradient-to-r ${cfg.color} rounded-2xl p-4 text-white hover:opacity-90 transition-opacity`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaWallet className="text-2xl opacity-80" />
            <div>
              <p className="text-xs opacity-80">QuickBite Wallet</p>
              <p className="text-xl font-black">${balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">{cfg.badge} {tier}</p>
            <p className="text-sm font-bold">{points} pts</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to="/wallet" className={`block bg-gradient-to-br ${cfg.color} rounded-3xl p-6 text-white hover:opacity-90 transition-opacity shadow-xl`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70 font-medium">QuickBite Wallet</p>
          <p className="text-4xl font-black mt-1">${balance.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <FaWallet className="text-xl" />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-70 mb-1">{cfg.badge} {tier} Member</p>
          <div className="flex items-center gap-2">
            <FaCoins className="text-yellow-300 text-sm" />
            <span className="font-bold text-lg">{points}</span>
            <span className="text-xs opacity-70">pts</span>
          </div>
          {cfg.nextAt && (
            <div className="mt-2">
              <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs opacity-60 mt-1">{cfg.next} at {cfg.nextAt} pts</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl font-medium">View All</span>
        </div>
      </div>
    </Link>
  )
}
