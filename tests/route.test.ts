import app from '../src/app'
import request from 'supertest'
import { pgn, diagrams } from './routes_helper'
import Pgn2Tex from '../src/utils/pgn2tex'

const api = request(app)

describe('Test Pgn2Tex library', () => {
  const gameTex = new Pgn2Tex(pgn, diagrams).toTex()
  test('toTex() returns a string', () => {
    expect(typeof gameTex).toBe('string')
  })
})

describe('Health check', () => {
  test('GET /health returns 200', async () => {
    await api.get('/health').expect(200)
  })
})
