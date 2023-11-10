import app from '../src/app'
// @ts-ignore
import request from 'supertest'
import { pgn, diagrams } from './routes_helper'
import * as path from 'node:path'

const api = request(app)

describe('Test the PDF routes', () => {
  test('POST method returns tex string', async () => {
    const data = {
      pgn,
      diagrams
    }
    const response = await api.post('/api/pdf').send(data)
    expect(response.statusCode).toBe(201)
  })
})

describe('Test the PGN routes', () => {
  test('Upload PGN file', async () => {
    const pgnFilePath = path.join(__dirname, 'pgn.pgn')
    const response = await api.post('/api/pgn').attach('file', pgnFilePath)
    expect(response.statusCode).toBe(200)
  })
})
