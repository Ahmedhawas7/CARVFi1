import express from 'express'
import { addScore, getScores } from '../controllers/scoreController.js'
const router = express.Router()

router.post('/add', addScore)
router.get('/list', getScores)

export default router
