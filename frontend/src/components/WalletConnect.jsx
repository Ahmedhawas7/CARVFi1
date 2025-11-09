import React from 'react'

export default function WalletConnect(){
  const [connected, setConnected] = React.useState(false)
  const [wallet, setWallet] = React.useState(null)

  const handleConnect = () => {
    setConnected(true)
    setWallet('0x123...456')
  }

  const handleDisconnect = () => {
    setConnected(false)
    setWallet(null)
  }

  return (
    <div className="wallet-connect">
      {connected ? (
        <>
          <button 
            onClick={handleDisconnect}
            className="btn text-sm px-3 py-1"
          >
            Disconnect
          </button>
          {wallet && (
            <div className="mt-2 text-xs text-accent bg-card px-2 py-1 rounded">
              {wallet}
            </div>
          )}
        </>
      ) : (
        <button 
          onClick={handleConnect}
          className="btn"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
