import Score from '../models/Score.js'
import User from '../models/User.js'

export const addScore = async (req, res) => {
  try {
    const { wallet, points, description, type } = req.body
    if(!wallet) return res.status(400).json({success:false, message:'wallet required'})
    
    const score = await Score.create({ wallet, points, description, type })
    
    await User.findOneAndUpdate(
      { wallet }, 
      { 
        $inc: { carvPoints: points },
        $set: { lastUpdated: new Date() }
      }, 
      { upsert: true }
    )
    
    return res.json({ success:true, data: score })
  } catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message:'Server error' })
  }
}

export const getScores = async (req, res) => {
  try{
    const wallet = req.query.wallet
    const list = await Score.find({ wallet }).sort({ createdAt: -1 }).limit(50)
    return res.json({ success:true, data: list })
  }catch(err){
    console.error(err)
    res.status(500).json({ success:false, message:'Server error' })
  }
}
