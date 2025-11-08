import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  points: { type: Number, default: 0 },
  description: { type: String },
  type: { type: String, enum: ['twitter', 'engagement', 'bonus'] },
  createdAt: { type: Date, default: Date.now }
})

const Score = mongoose.model('Score', scoreSchema)
export default Score
