import { Router, Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'
import SwaggerParser from '@apidevtools/swagger-parser'
import path from 'path'

const router = Router()

const apiDefinition = async () => {
  const parser = new SwaggerParser()
  return await parser.validate(path.join(__dirname, '../../docs/openapi.json'))
}

router.use('/', swaggerUi.serve)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const openapi = await apiDefinition()
  swaggerUi.setup(openapi)(req, res, next)
})

export default router
