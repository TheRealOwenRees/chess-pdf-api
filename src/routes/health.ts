import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ type: 'success', message: 'API is up and running' })
  } catch {
    res.status(500).json({ type: 'error', message: 'Internal server error' })
  }
})

export default router
