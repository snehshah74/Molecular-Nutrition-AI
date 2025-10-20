import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/database.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email?: string
  }
  params: any
  headers: any
  body: any
  query: any
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No authorization token provided' })
      return
    }

    const token = authHeader.substring(7)

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

