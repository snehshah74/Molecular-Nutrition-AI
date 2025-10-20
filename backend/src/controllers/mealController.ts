import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { supabase } from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

export async function getMeals(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { startDate, endDate } = req.query

    let query = supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('meal_time', { ascending: false })

    if (startDate) {
      query = query.gte('meal_time', startDate as string)
    }
    if (endDate) {
      query = query.lte('meal_time', endDate as string)
    }

    const { data, error } = await query

    if (error) {
      throw createError('Failed to fetch meals', 500)
    }

    res.json({ meals: data })
  } catch (error) {
    console.error('Get meals error:', error)
    res.status(500).json({ error: 'Failed to fetch meals' })
  }
}

export async function getMealById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      throw createError('Meal not found', 404)
    }

    res.json({ meal: data })
  } catch (error) {
    console.error('Get meal error:', error)
    res.status(500).json({ error: 'Failed to fetch meal' })
  }
}

export async function createMeal(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const mealData = req.body

    const { data, error } = await supabase
      .from('meals')
      .insert({
        ...mealData,
        user_id: userId,
      })
      .select()
      .single()

    if (error) {
      throw createError('Failed to create meal', 500)
    }

    res.status(201).json({ meal: data })
  } catch (error) {
    console.error('Create meal error:', error)
    res.status(500).json({ error: 'Failed to create meal' })
  }
}

export async function updateMeal(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw createError('Failed to update meal', 500)
    }

    res.json({ meal: data })
  } catch (error) {
    console.error('Update meal error:', error)
    res.status(500).json({ error: 'Failed to update meal' })
  }
}

export async function deleteMeal(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw createError('Failed to delete meal', 500)
    }

    res.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Delete meal error:', error)
    res.status(500).json({ error: 'Failed to delete meal' })
  }
}

export async function getDailyNutritionSummary(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { date } = req.query

    const startDate = date ? new Date(date as string) : new Date()
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(startDate)
    endDate.setHours(23, 59, 59, 999)

    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_time', startDate.toISOString())
      .lte('meal_time', endDate.toISOString())

    if (error) {
      throw createError('Failed to fetch daily nutrition', 500)
    }

    // Calculate total nutrition
    const totalNutrition = meals?.reduce((acc, meal) => {
      const nutrition = meal.total_nutrition || {}
      return {
        calories: (acc.calories || 0) + (nutrition.calories || 0),
        protein: (acc.protein || 0) + (nutrition.protein || 0),
        carbs: (acc.carbs || 0) + (nutrition.carbs || 0),
        fat: (acc.fat || 0) + (nutrition.fat || 0),
        fiber: (acc.fiber || 0) + (nutrition.fiber || 0),
      }
    }, {} as any)

    res.json({ 
      date: startDate.toISOString().split('T')[0],
      meals,
      totalNutrition 
    })
  } catch (error) {
    console.error('Get daily nutrition error:', error)
    res.status(500).json({ error: 'Failed to fetch daily nutrition' })
  }
}

