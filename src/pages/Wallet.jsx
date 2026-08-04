import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaWallet, FaArrowUp, FaArrowDown, FaPlus, FaQrcode, FaGift, FaCopy, FaShareAlt } from 'react-icons/fa'
import { useWallet } from '../contexts/WalletContext.jsx'
import WalletCard from '../components/WalletCard.jsx'
import { coupons } from '../data/dummyData.js'

export default function Wallet() {
  const { transactions, referralCode } = useWallet()

  const getTxIcon = (type) => {
    switch (type) {
      case 'cashback': return <span className="text-green-500">💚</span>
      case 'refund': return <span className="text-blue-500">🔵</span>
      case 'topup': return <span className="text-primary-500">⬆️</span>
      default: return <span className="text-red-500">🔴</span>
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    alert('Code copied!')
  }

  return (
    <div className="page-container pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-full transition-colors">
            <FaArrowLeft className="text-dark-900 dark:text-white" />
          </Link>
          <h1 className="text-xl font-bold text-dark-900 dark:text-white">QuickBite Wallet</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Main Card */}
        <WalletCard />

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: <FaPlus />, label: 'Add Money', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            { icon: <FaQrcode />, label: 'Pay', color: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' },
            { icon: <FaArrowUp />, label: 'Send', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
            { icon: <FaGift />, label: 'Gift', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
          ].map(action => (
            <button key={action.label} onClick={() => alert('Coming soon!')} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-105 active:scale-95 ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Referral */}
        <div className="bg-gradient-to-r from-primary-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Invite & Earn!</h3>
              <p className="text-primary-100 text-sm">Earn $5 for every friend who places their first order.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 p-2 rounded-2xl backdrop-blur-sm w-full md:w-auto">
              <div className="bg-white/90 text-primary-600 px-4 py-2 rounded-xl font-mono font-bold tracking-wider grow text-center">
                {referralCode}
              </div>
              <button onClick={handleCopy} className="p-3 hover:bg-white/20 rounded-xl transition-colors">
                <FaCopy />
              </button>
              <button onClick={() => alert('Share opened')} className="p-3 hover:bg-white/20 rounded-xl transition-colors">
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="section-card">
            <h3 className="font-bold text-dark-900 dark:text-white mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-dark-700 rounded-xl flex items-center justify-center text-lg">
                        {getTxIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-dark-900 dark:text-white">{tx.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-dark-900 dark:text-white'}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Coupons */}
          <div className="section-card">
            <h3 className="font-bold text-dark-900 dark:text-white mb-4">Available Offers</h3>
            <div className="space-y-3">
              {coupons.map(coupon => (
                <div key={coupon.code} className="flex items-center gap-4 p-3 border border-dashed border-gray-200 dark:border-dark-600 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-mono font-bold px-3 py-1.5 rounded-lg text-sm shrink-0">
                    {coupon.code}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark-900 dark:text-white truncate">{coupon.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min. order ${coupon.minOrder}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
