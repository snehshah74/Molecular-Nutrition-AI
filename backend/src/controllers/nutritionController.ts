import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { searchFoodData, getFoodNutritionData } from '../services/nutritionService.js'

export async function searchFood(req: AuthRequest, res: Response) {
  try {
    const { query } = req.query

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Search query is required' })
      return
    }

    const results = await searchFoodData(query)
    res.json({ results })
  } catch (error) {
    console.error('Search food error:', error)
    res.status(500).json({ error: 'Failed to search food' })
  }
}

export async function getFoodNutrition(req: AuthRequest, res: Response) {
  try {
    const { foodId } = req.params

    const nutrition = await getFoodNutritionData(foodId)
    
    if (!nutrition) {
      res.status(404).json({ error: 'Food not found' })
      return
    }

    res.json({ nutrition })
  } catch (error) {
    console.error('Get food nutrition error:', error)
    res.status(500).json({ error: 'Failed to fetch nutrition data' })
  }
}

export async function calculateNutrition(req: AuthRequest, res: Response) {
  try {
    const { foods } = req.body

    if (!Array.isArray(foods)) {
      res.status(400).json({ error: 'Foods array is required' })
      return
    }

    // Calculate total nutrition from all foods
    const totalNutrition = foods.reduce((acc, food) => {
      return {
        calories: (acc.calories || 0) + (food.calories || 0),
        protein: (acc.protein || 0) + (food.protein || 0),
        carbs: (acc.carbs || 0) + (food.carbs || 0),
        fat: (acc.fat || 0) + (food.fat || 0),
        fiber: (acc.fiber || 0) + (food.fiber || 0),
        vitamins: {
          ...acc.vitamins,
          ...Object.keys(food.vitamins || {}).reduce((v, key) => ({
            ...v,
            [key]: (acc.vitamins?.[key] || 0) + (food.vitamins[key] || 0)
          }), {})
        },
        minerals: {
          ...acc.minerals,
          ...Object.keys(food.minerals || {}).reduce((m, key) => ({
            ...m,
            [key]: (acc.minerals?.[key] || 0) + (food.minerals[key] || 0)
          }), {})
        }
      }
    }, { vitamins: {}, minerals: {} } as any)

    res.json({ totalNutrition })
  } catch (error) {
    console.error('Calculate nutrition error:', error)
    res.status(500).json({ error: 'Failed to calculate nutrition' })
  }
}

