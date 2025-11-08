import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import scoreRoutes from './routes/scoreRoutes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req,res) => res.send({status:'CARVFi API running'}))

app.use('/api/users', userRoutes)
app.use('/api/scores', scoreRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`))
