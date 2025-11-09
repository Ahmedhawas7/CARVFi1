import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'
import '@solana/wallet-adapter-react-ui/styles.css';

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-1 to-bg-2">
      <Header />
      <main>
        <Hero />
        <Dashboard />
      </main>
      <Footer />
    </div>
  )
}
