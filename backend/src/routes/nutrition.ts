import { Router } from 'express'
import * as nutritionController from '../controllers/nutritionController.js'

const router = Router()

// Search for food nutrition data
router.get('/search', nutritionController.searchFood)

// Get nutrition data for a specific food
router.get('/food/:foodId', nutritionController.getFoodNutrition)

// Calculate nutrition for a recipe
router.post('/calculate', nutritionController.calculateNutrition)

export default router

