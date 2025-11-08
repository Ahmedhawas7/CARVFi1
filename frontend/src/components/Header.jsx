import React from 'react'
import { motion } from 'framer-motion'
import WalletConnect from './WalletConnect'

export default function Header(){
  return (
    <header className="container">
      <motion.div 
        className="logoTitle" 
        initial={{opacity:0, y:-10}} 
        animate={{opacity:1, y:0}}
        transition={{duration: 0.5}}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-accent to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        <h1 className="text-accent text-xl font-bold">CARVFi</h1>
      </motion.div>

      <nav className="nav">
        <a href="#home" className="hover:text-yellow-300 transition-colors">Home</a>
        <a href="#features" className="hover:text-yellow-300 transition-colors">Features</a>
        <a href="#dashboard" className="hover:text-yellow-300 transition-colors">Dashboard</a>
        <WalletConnect />
      </nav>
    </header>
  )
}
