import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { supabase } from '../config/database.js'
import { createError } from '../middleware/errorHandler.js'

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw createError('Failed to fetch profile', 500)
    }

    res.json({ profile: data || null })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export async function upsertProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const profileData = req.body

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        ...profileData,
        user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw createError('Failed to save profile', 500)
    }

    res.json({ profile: data })
  } catch (error) {
    console.error('Upsert profile error:', error)
    res.status(500).json({ error: 'Failed to save profile' })
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id
    const updates = req.body

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw createError('Failed to update profile', 500)
    }

    res.json({ profile: data })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export async function deleteProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw createError('Failed to delete profile', 500)
    }

    res.json({ message: 'Profile deleted successfully' })
  } catch (error) {
    console.error('Delete profile error:', error)
    res.status(500).json({ error: 'Failed to delete profile' })
  }
}

