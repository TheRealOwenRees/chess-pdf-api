import app from '../src/app'
import request from 'supertest'
import { pgn, diagrams } from './routes_helper'
import Pgn2Tex from '@owenrees/pgn2tex'

const api = request(app)

describe('Test Pgn2Tex library', () => {
  const instance = new Pgn2Tex(pgn, diagrams)
  const gameTex = instance.toTex()
  test('toTex() returns a string', () => {
    expect(typeof gameTex).toBe('string')
  })
})

describe('Health check', () => {
  test('GET /health returns 200', async () => {
    await api.get('/api/v1/health').expect(200)
  })
})
