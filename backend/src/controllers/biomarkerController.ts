import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { supabase } from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

export async function getBiomarkers(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    if (!userId) {
      throw createError('User not authenticated', 401)
    }

    const { data, error } = await supabase
      .from('biomarkers')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      throw createError('Failed to fetch biomarkers', 500)
    }

    res.json({ biomarkers: data })
  } catch (error: any) {
    console.error('Get biomarkers error:', error)
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch biomarkers' })
  }
}

export async function getBiomarkerByDate(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    if (!userId) {
      throw createError('User not authenticated', 401)
    }
    const { date } = req.params

    const { data, error } = await supabase
      .from('biomarkers')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw createError('Failed to fetch biomarker', 500)
    }

    res.json({ biomarker: data || null })
  } catch (error: any) {
    console.error('Get biomarker error:', error)
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch biomarker' })
  }
}

export async function upsertBiomarker(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    if (!userId) {
      throw createError('User not authenticated', 401)
    }
    const biomarkerData = req.body

    const { data, error } = await supabase
      .from('biomarkers')
      .upsert({
        ...biomarkerData,
        user_id: userId,
      })
      .select()
      .single()

    if (error) {
      throw createError('Failed to save biomarker', 500)
    }

    res.json({ biomarker: data })
  } catch (error: any) {
    console.error('Upsert biomarker error:', error)
    res.status(error.status || 500).json({ error: error.message || 'Failed to save biomarker' })
  }
}

export async function deleteBiomarker(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    if (!userId) {
      throw createError('User not authenticated', 401)
    }
    const { id } = req.params

    const { error } = await supabase
      .from('biomarkers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw createError('Failed to delete biomarker', 500)
    }

    res.json({ message: 'Biomarker deleted successfully' })
  } catch (error: any) {
    console.error('Delete biomarker error:', error)
    res.status(error.status || 500).json({ error: error.message || 'Failed to delete biomarker' })
  }
}

