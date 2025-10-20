import { Router, Request, Response } from 'express'
import { config } from '../config/env.js'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0',
  })
})

export default router

