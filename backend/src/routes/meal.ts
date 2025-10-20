import { Router } from 'express'
import * as mealController from '../controllers/mealController.js'

const router = Router()

// Get all meals for a date range
router.get('/', mealController.getMeals)

// Get a specific meal
router.get('/:id', mealController.getMealById)

// Create a new meal
router.post('/', mealController.createMeal)

// Update a meal
router.put('/:id', mealController.updateMeal)

// Delete a meal
router.delete('/:id', mealController.deleteMeal)

// Get daily nutrition summary
router.get('/summary/daily', mealController.getDailyNutritionSummary)

export default router

