import User from '../models/User.js'
import { analyzeTwitterActivity } from '../utils/twitterAPI.js'

export const getOrCreateUser = async (req, res) => {
  try {
    const { wallet } = req.body
    if(!wallet) return res.status(400).json({success:false, message:'wallet required'})

    let user = await User.findOne({ wallet })
    if(!user){
      user = await User.create({ 
        wallet, 
        carvPoints: Math.floor(Math.random() * 500) + 100
      })
    }
    return res.json({ success:true, data: user })
  } catch(err){
    console.error(err)
    return res.status(500).json({ success:false, message:'Server error' })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const wallet = req.query.wallet
    if(!wallet) return res.status(400).json({success:false, message:'wallet query missing'})
    
    const user = await User.findOne({ wallet })
    if(!user) return res.status(404).json({success:false, message:'User not found'})
    
    const twitterData = await analyzeTwitterActivity(wallet)
    
    return res.json({ 
      success: true, 
      data: { 
        points: user.carvPoints, 
        tweets: twitterData.data.tweets,
        engagement: twitterData.data.engagement,
        wallet: wallet
      } 
    })
  } catch(err){
    console.error(err)
    res.status(500).json({ success:false, message:'Server error' })
  }
}
