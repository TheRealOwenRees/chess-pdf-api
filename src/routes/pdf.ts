import { Router, Request, Response } from 'express'
import logger from '../utils/logger'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { stripPreambleFromTex } from '../utils/preamble'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { texString } = req.body

  const texStringWithoutPreamble = stripPreambleFromTex(texString)

  const tempId = Date.now()
  const tempDir = os.tmpdir()
  const texFilePath = path.join(tempDir, `game-${tempId}.tex`)
  const pdfFilePath = path.join(tempDir, `game-${tempId}.pdf`)

  try {
    fs.writeFileSync(texFilePath, texStringWithoutPreamble)

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
        })
      } else {
        res.status(500).json({ type: 'error', message: 'PDF generation failed' })
      }
    })

    process.on('error', async (error) => {
      logger.error(error.message)
      await logger.discord({ type: 'error', message: error.message })
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    } else {
      logger.error('Unknown Error')
      await logger.discord({ type: 'error', message: 'Unknown Error' })
    }
  }
})

export default router
