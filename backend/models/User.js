import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  twitterUsername: { type: String },
  carvPoints: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)
export default User
