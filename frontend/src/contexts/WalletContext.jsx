import React, { createContext, useContext, useState } from 'react'

const WalletContext = createContext()

export const WalletContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = () => setIsConnected(true)
  const disconnectWallet = () => setIsConnected(false)

  return (
    <WalletContext.Provider value={{ isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWalletContext must be used within WalletContextProvider')
  }
  return context
}
