import app from '../src/app'
import request from 'supertest'

const api = request(app)

describe('Health check', () => {
  test('GET /health returns 200', async () => {
    await api.get('/api/v1/health').expect(200)
  })
})
