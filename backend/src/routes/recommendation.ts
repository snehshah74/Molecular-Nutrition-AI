import { Router } from 'express'
import * as recommendationController from '../controllers/recommendationController.js'

const router = Router()

// Get all recommendations
router.get('/', recommendationController.getRecommendations)

// Generate new AI recommendations
router.post('/generate', recommendationController.generateRecommendations)

// Mark recommendation as read
router.put('/:id/read', recommendationController.markAsRead)

// Delete recommendation
router.delete('/:id', recommendationController.deleteRecommendation)

export default router

