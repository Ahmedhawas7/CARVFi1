import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
  return (
    <section id="home" className="hero">
      <motion.h2 
        initial={{opacity:0, y:10}} 
        animate={{opacity:1, y:0}}
        transition={{duration: 0.6}}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Empower Your Web3 Identity
      </motion.h2>
      
      <motion.p 
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{delay:0.2, duration: 0.6}}
        className="text-lg md:text-xl mb-8"
      >
        Connect your Solana wallet, analyze your social activity, and earn CARV points in our decentralized identity platform.
      </motion.p>
      
      <motion.div 
        initial={{opacity:0, scale:0.9}} 
        animate={{opacity:1, scale:1}}
        transition={{delay:0.4, duration: 0.5}}
      >
        <a href="#dashboard">
          <button className="btn text-lg px-8 py-3">
            🚀 Go to Dashboard
          </button>
        </a>
      </motion.div>

      <motion.div 
        className="grid mt-16 max-w-4xl mx-auto"
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{delay:0.6, duration: 0.5}}
      >
        <div className="card text-center">
          <div className="text-2xl mb-2">🔗</div>
          <h3 className="text-accent font-semibold mb-2">Wallet Connect</h3>
          <p className="text-muted">Secure connection with Solana wallets</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-2">🐦</div>
          <h3 className="text-accent font-semibold mb-2">Social Analysis</h3>
          <p className="text-muted">Analyze your Twitter activity and engagement</p>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="text-accent font-semibold mb-2">CARV Points</h3>
          <p className="text-muted">Earn rewards for your Web3 presence</p>
        </div>
      </motion.div>
    </section>
  )
}
