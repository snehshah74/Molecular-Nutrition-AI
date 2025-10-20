import { Router } from 'express'
import * as profileController from '../controllers/profileController.js'

const router = Router()

// Get user profile
router.get('/', profileController.getProfile)

// Create or update profile
router.post('/', profileController.upsertProfile)

// Update profile
router.put('/', profileController.updateProfile)

// Delete profile
router.delete('/', profileController.deleteProfile)

export default router

