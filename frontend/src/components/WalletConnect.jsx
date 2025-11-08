import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function WalletConnect(){
  const { connected, publicKey } = useWallet()

  return (
    <div className="wallet-connect">
      <WalletMultiButton />
      {connected && publicKey && (
        <div className="mt-2 text-xs text-accent bg-card px-2 py-1 rounded">
          {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
        </div>
      )}
    </div>
  )
}
