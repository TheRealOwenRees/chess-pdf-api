import express, { type Express } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { corsOptions } from './utils/config'

import pdfRouter from './routes/pdf'
import apiDocs from './routes/docs'
import { unknownEndpoint, serverError } from './middleware/errorHandlers'

const app: Express = express()

// middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/api/v1/pdf', pdfRouter)
app.use('/docs', apiDocs)

// error handlers
app.use(unknownEndpoint)
app.use(serverError)

export default app
