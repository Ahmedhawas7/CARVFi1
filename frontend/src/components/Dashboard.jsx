import React, { useEffect, useState } from 'react'
import { API_URL } from '../config'

// ===== استدعاءات CARVFi الجديدة =====
import { getUserPoints, saveUserPoints } from '../integration/svmClient'
import { getRewardSuggestion } from '../integration/aiClient'

export default function Dashboard() {
  const [stats, setStats] = useState({ points: 0, tweets: 0, engagement: 0 })
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [aiSuggestion, setAiSuggestion] = useState(null)

  // ===== Fetch البيانات من API القديم =====
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/scores`)
        const data = await response.json()
        if (data) {
          setStats({
            points: data.points || 0,
            tweets: data.tweets || 0,
            engagement: data.engagement || 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
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
  }, [])

  // ===== Fetch نقاط المستخدم من CARV SVM + اقتراح AI =====
  useEffect(() => {
    if (!isConnected) return

    async function fetchPointsAndAI() {
      try {
        const points = await getUserPoints('USER_ID_PLACEHOLDER') // ضع هنا معرف المستخدم الخاص بك
        setUserPoints(points)

        const suggestion = await getRewardSuggestion('USER_ID_PLACEHOLDER')
        setAiSuggestion(suggestion)
      } catch (err) {
        console.error('Error fetching CARV points or AI:', err)
      }
    }

    fetchPointsAndAI()
  }, [isConnected])

  async function handleAddPoints(amount) {
    const newPoints = userPoints + amount
    await saveUserPoints('USER_ID_PLACEHOLDER', newPoints)
    setUserPoints(newPoints)
  }

  if (!isConnected) {
    return (
      <section id="dashboard" className="container mt-6">
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-2xl font-bold text-accent mb-4">Connect Your Wallet</h3>
          <p className="text-muted text-lg max-w-md mx-auto">
            Please connect your wallet to view your CARV points and social statistics.
          </p>
          <button
            onClick={() => setIsConnected(true)}
            className="btn mt-6"
          >
            Connect Wallet
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="dashboard" className="container my-8">
      <h2 className="text-3xl font-bold text-accent text-center mb-8">Your Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">{stats.points}</div>
            <p className="text-muted">CARV Points (API)</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">{stats.tweets}</div>
            <p className="text-muted">Tweets</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">{stats.engagement}%</div>
            <p className="text-muted">Engagement</p>
          </div>
        </div>
      </div>

      {/* ===== CARV SVM Points ===== */}
      <div className="card mt-6 text-center p-4 bg-yellow-50">
        <h3 className="text-xl font-bold mb-2">CARV SVM Points</h3>
        <p className="text-3xl font-bold text-accent">{userPoints}</p>

        {aiSuggestion && (
          <div className="bg-yellow-100 p-3 rounded mt-3">
            💡 AI Suggestion: {aiSuggestion}
            <button
              onClick={() => handleAddPoints(parseInt(aiSuggestion))}
              className="ml-2 p-1 bg-green-500 text-white rounded"
            >
              Accept Points
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-center mt-6 text-accent">Loading...</p>}
    </section>
  )
}
