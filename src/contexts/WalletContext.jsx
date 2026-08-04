import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'

const WalletContext = createContext(null)

const DEFAULT_STATE = {
  balance: 50.00,
  points: 250,
  referralCode: 'QUICKB-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  transactions: [
    { id: 't1', type: 'cashback', amount: 5.00, description: 'Cashback on Burger Kingpin order', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 't2', type: 'refund', amount: 12.50, description: 'Refund for cancelled order #ord-123', date: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 't3', type: 'topup', amount: 50.00, description: 'Wallet top-up', date: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 't4', type: 'payment', amount: -22.49, description: 'Paid for Pizza Palace order', date: new Date(Date.now() - 7 * 86400000).toISOString() },
  ]
}

function loadWallet() {
  try {
    const data = localStorage.getItem('qb_wallet')
    if (data) return JSON.parse(data)
  } catch {}
  return DEFAULT_STATE
}

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(loadWallet)

  useEffect(() => {
    localStorage.setItem('qb_wallet', JSON.stringify(wallet))
  }, [wallet])

  const tier = useMemo(() => {
    if (wallet.points >= 1000) return 'Gold'
    if (wallet.points >= 500) return 'Silver'
    return 'Bronze'
  }, [wallet.points])

  const addTransaction = useCallback(({ type, amount, description }) => {
    const t = { id: `t-${Date.now()}`, type, amount, description, date: new Date().toISOString() }
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [t, ...prev.transactions],
    }))
  }, [])

  const addPoints = useCallback((pts) => {
    setWallet(prev => ({ ...prev, points: prev.points + pts }))
  }, [])

  const useWalletBalance = useCallback((amount) => {
    setWallet(prev => {
      if (prev.balance < amount) return prev
      const t = { id: `t-${Date.now()}`, type: 'payment', amount: -amount, description: 'Wallet payment for order', date: new Date().toISOString() }
      return { ...prev, balance: prev.balance - amount, transactions: [t, ...prev.transactions] }
    })
  }, [])

  return (
    <WalletContext.Provider value={{ ...wallet, tier, addTransaction, addPoints, useWalletBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
