import { Router, Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'
import SwaggerParser from '@apidevtools/swagger-parser'

const router = Router()

export const apiDefinition = async (apiDocs: string) => {
  const parser = new SwaggerParser()
  try {
    return await parser.validate(apiDocs)
  } catch (error) {
    console.log(error)
    throw Error('API documentation not found')
  }
}

router.use('/', swaggerUi.serve)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiDocs = 'docs/openapi.json'
    const openapi = await apiDefinition(apiDocs)
    swaggerUi.setup(openapi)(req, res, next)
  } catch (error) {
    res.status(404).json({ type: 'error', message: 'API documentation not found' })
  }
})

export default router
