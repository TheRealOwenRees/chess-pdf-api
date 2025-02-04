import { Router, Request, Response } from 'express'
import strStream from 'string-to-stream'
import latex from 'node-latex'
import Pgn2Tex from '@owenrees/pgn2tex'
import logger from '../utils/logger'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { pgn, diagrams, diagramClock } = req.body

  try {
    const gameTex = new Pgn2Tex(pgn, diagrams, diagramClock).toTex()
    const texFile = strStream(gameTex)
    // @ts-ignore
    const pdf = latex(texFile)
    let errorOccurred = false

    pdf.on('error', async (error) => {
      errorOccurred = true
      logger.error(error.message)
      await logger.discord({ type: 'error', message: error.message })
      if (!res.headersSent) {
        res.setHeader('Content-Disposition', '')
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({ type: 'error', message: error.message })
      }
    })

    pdf.on('end', async () => {
      if (!errorOccurred && !res.headersSent) {
        logger.info('PDF Generated')
        await logger.discord({ type: 'info', message: 'PDF Generated' })
      }
    })

    if (!errorOccurred) {
      res.setHeader('Content-Disposition', 'inline')
      res.setHeader('Content-Type', 'application/pdf')
      res.status(201)
      pdf.pipe(res)
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
      await logger.discord({ type: 'error', message: error.message })
      res.setHeader('Content-Disposition', '')
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({ type: 'error', message: error.message })
    } else {
      logger.error('Unknown Error')
      await logger.discord({ type: 'error', message: 'Unknown Error' })
      res.setHeader('Content-Disposition', '')
      res.setHeader('Content-Type', 'application/json')
      res.status(500).json({ type: 'error', message: 'Unknown Error' })
    }
  }
})

export default router
