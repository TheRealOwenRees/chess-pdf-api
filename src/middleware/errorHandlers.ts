import { Request, Response } from 'express'

export const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).json({ type: 'error', message: 'unknown endpoint' })
}

export const serverError = (request: Request, response: Response) => {
  response.status(500).json({ type: 'error', message: 'An internal error has occurred' })
}
