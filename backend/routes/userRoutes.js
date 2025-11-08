import express from 'express'
import { getOrCreateUser, getUserStats } from '../controllers/userController.js'
const router = express.Router()

router.post('/connect', getOrCreateUser)
router.get('/stats', getUserStats)

export default router
