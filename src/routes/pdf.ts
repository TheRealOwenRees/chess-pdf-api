import { Router, Request, Response } from 'express'
import logger from '../utils/logger'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { stripPreambleFromTex } from '../utils/preamble'
import { recordMetrics } from '../utils/metrics'

import * as pgnParser from '../../pgn2tex.cjs'
const pgn2tex = pgnParser as any

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const startMs = Date.now()

  const { pgn, diagrams, diagramClock } = req.body

  const tempId = Date.now()
  const tempDir = os.tmpdir()

  const texFilePath = path.join(tempDir, `game-${tempId}.tex`)
  const pdfFilePath = path.join(tempDir, `game-${tempId}.pdf`)

  try {
    console.log('DIAGRAMS: ', diagrams)
    console.log('CLOCK: ', diagramClock)

    // TODO diagrams are array, OCaml may need to convert these?

    // TODO check if OCaml parser emits preamble
    const gameTex = pgn2tex.convert(pgn, '{}', diagramClock)
    const gameTexWithoutPreamble = stripPreambleFromTex(gameTex)
    console.log('gameTexWithoutPreamble: ', gameTexWithoutPreamble)

    fs.writeFileSync(texFilePath, gameTexWithoutPreamble)

    const process = spawn('pdflatex', [
      '-fmt',
      '/usr/src/app/preambles/chess',
      '-interaction=nonstopmode',
      `-output-directory=${tempDir}`,
      texFilePath
    ])

    process.on('close', async () => {
      if (fs.existsSync(pdfFilePath)) {
        res.setHeader('Content-Disposition', 'inline')
        res.setHeader('Content-Type', 'application/pdf')
        res.status(201)

        const rs = fs.createReadStream(pdfFilePath)
        rs.pipe(res)

        rs.on('end', () => {
          ;[texFilePath, pdfFilePath, texFilePath.replace('.tex', '.log'), texFilePath.replace('.tex', '.aux')].forEach(
            (f) => {
              if (fs.existsSync(f)) fs.unlinkSync(f)
            }
          )

          recordMetrics('SUCCESS', startMs)
        })
      } else {
        const error = new Error('PDF generation failed')
        recordMetrics('FAIL', startMs, error)
        res.status(500).json({ type: 'error', message: error.message })
      }
    })

    process.on('error', async (error) => {
      recordMetrics('FAIL', startMs, error)
      logger.error(error.message)
      await logger.discord({ type: 'error', message: error.message })
    })
  } catch (error) {
    if (error instanceof Error) {
      recordMetrics('FAIL', startMs, error)
      logger.error(error.message)
    } else {
      const error = new Error('Unknown Error')
      recordMetrics('FAIL', startMs, error)
      logger.error('Unknown Error')
      await logger.discord({ type: 'error', message: error.message })
    }
  }
})

export default router
