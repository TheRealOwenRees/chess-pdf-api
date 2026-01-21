import app from '../src/app'
import request from 'supertest'
import { apiDefinition } from '../src/routes/docs'

const api = request(app)

describe('Test the API documentation route', () => {
  test('should successfully parse a valid API definition file', async () => {
    const apiDocs = 'docs/openapi.json'
    const response = await apiDefinition(apiDocs)
    expect(typeof response).toBe('object')
  })
  test('should handle and throw an error for an invalid API definition file', async () => {
    const apiDocs = 'non-existent-file.json'
    await expect(apiDefinition(apiDocs)).rejects.toThrow()
  })
  test('test docs endpoint', async () => {
    const response = await api.get('/')
    expect(response).toBeTruthy() // TODO test for HTML / docs
  })
})
