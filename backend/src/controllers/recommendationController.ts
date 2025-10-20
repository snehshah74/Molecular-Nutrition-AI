import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { supabase } from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'
import { generateAIRecommendations } from '../services/aiService.js'

export async function getRecommendations(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw createError('Failed to fetch recommendations', 500)
    }

    res.json({ recommendations: data })
  } catch (error) {
    console.error('Get recommendations error:', error)
    res.status(500).json({ error: 'Failed to fetch recommendations' })
  }
}

export async function generateRecommendations(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!profile) {
      throw createError('Profile not found', 404)
    }

    // Get recent meals
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const { data: meals } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('meal_time', sevenDaysAgo.toISOString())

    // Generate AI recommendations
    const recommendations = await generateAIRecommendations(profile, meals || [])

    // Save recommendations to database
    const { data: savedRecommendations, error } = await supabase
      .from('recommendations')
      .insert(
        recommendations.map(rec => ({
          ...rec,
          user_id: userId,
        }))
      )
      .select()

    if (error) {
      throw createError('Failed to save recommendations', 500)
    }

    res.json({ recommendations: savedRecommendations })
  } catch (error) {
    console.error('Generate recommendations error:', error)
    res.status(500).json({ error: 'Failed to generate recommendations' })
  }
}

export async function markAsRead(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    // For now, we'll just return success
    // You can add a 'read' column to the recommendations table if needed
    res.json({ message: 'Recommendation marked as read' })
  } catch (error) {
    console.error('Mark as read error:', error)
    res.status(500).json({ error: 'Failed to mark recommendation as read' })
  }
}

export async function deleteRecommendation(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw createError('Failed to delete recommendation', 500)
    }

    res.json({ message: 'Recommendation deleted successfully' })
  } catch (error) {
    console.error('Delete recommendation error:', error)
    res.status(500).json({ error: 'Failed to delete recommendation' })
  }
}

