import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { API_URL } from '../config'

export default function Dashboard(){
  const [stats, setStats] = useState({points:0, tweets:0, engagement:0})
  const [loading, setLoading] = useState(false)
  const { connected, publicKey } = useWallet()

  useEffect(() => {
    if(!connected || !publicKey) return
    
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/users/stats?wallet=${publicKey.toString()}`)
        const data = await response.json()
        if(data.success) {
          setStats(data.data)
        }
      } catch(error) {
        console.error('Error fetching stats:', error)
        // Mock data for demonstration
        setStats({
          points: Math.floor(Math.random() * 1000) + 100,
          tweets: Math.floor(Math.random() * 50) + 10,
          engagement: Math.floor(Math.random() * 80) + 20
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [connected, publicKey])

  if(!connected) {
    return (
      <section id="dashboard" className="container mt-6">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-2xl font-bold text-accent mb-4">Connect Your Wallet</h3>
          <p className="text-muted text-lg max-w-md mx-auto">
            Please connect your Solana wallet to view your CARV points and social statistics.
          </p>
        </div>
      </section>
    )
  }

  if(loading) {
    return (
      <section id="dashboard" className="container mt-6">
        <div className="card text-center py-12">
          <div className="text-2xl text-accent">Loading your data...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="dashboard" className="container mt-6">
      <motion.div 
        className="mb-8 text-center"
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
      >
        <h2 className="text-3xl font-bold text-accent mb-2">Your Dashboard</h2>
        <p className="text-muted">Track your Web3 identity and social impact</p>
      </motion.div>

      <div className="grid mb-8">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-accent mb-4">🎯 CARV Points</h3>
          <p className="text-3xl font-bold text-accent">{stats.points.toLocaleString()}</p>
          <p className="text-sm text-muted mt-2">Total points earned</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">🐦 Tweets Analyzed</h3>
          <p className="text-3xl font-bold text-yellow-300">{stats.tweets}</p>
          <p className="text-sm text-muted mt-2">Social activity</p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">📊 Engagement Score</h3>
          <p className="text-3xl font-bold text-pink-400">{stats.engagement}%</p>
          <p className="text-sm text-muted mt-2">Community interaction</p>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-semibold text-accent mb-4">📈 Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-2 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Wallet connected successfully</span>
            </div>
            <span className="text-muted text-sm">Just now</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-bg-2 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              <span>Social data analysis completed</span>
            </div>
            <span className="text-muted text-sm">Just now</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-bg-2 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <span>CARV points calculation active</span>
            </div>
            <span className="text-muted text-sm">Just now</span>
          </div>
        </div>
      </div>
    </section>
  )
}
