import { Router, Request, Response } from 'express'
import strStream from 'string-to-stream'
import latex from 'node-latex'

import Pgn2Tex from '@owenrees/pgn2tex'

import logger from '../utils/logger'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  const { pgn, diagrams } = req.body

  try {
    const gameTex = new Pgn2Tex(pgn, diagrams).toTex()
    const texFile = strStream(gameTex)

    // @ts-ignore
    const pdf = latex(texFile)

    pdf.on('error', (err) => {
      logger.error(err)
      throw new Error('PDF generation failed')
    })

    pdf.on('finish', () => {
      logger.info('PDF Generated')
    })

    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('Content-Type', 'application/pdf')
    res.status(201)
    pdf.pipe(res)
  } catch (error) {
    res.status(500).json({ type: 'error', message: 'Something went wrong' })
  }
})

export default router
