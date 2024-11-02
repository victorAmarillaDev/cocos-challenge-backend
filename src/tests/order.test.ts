import request from 'supertest'
import app from '../app'
import { AppDataSource } from '../config/db'

describe('POST /api/order - Create Order', () => {

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })

  test('should return 201 and create a rejected sell order when the user lacks sufficient funds', async () => {
    const orderData = {
      instrumentId: 1,
      side: 'SELL',
      size: 10000,
      type: 'MARKET',
      userId: 1,
    }

    const response = await request(app)
      .post('/api/order')
      .send(orderData)

      const mockOrder = {
        id: expect.any(Number),
        instrumentId: { id: 1 },
        userId: { id: 1 },
        side: 'SELL',
        size: 10000,
        type: 'MARKET',
        price: '260.00',
        status: 'REJECTED',
        dateTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
      }

    expect(response.statusCode).toBe(201)
    expect(response.body.order).toMatchObject(mockOrder)
  })

  test('should return 404 when the user does not exist', async () => {
    const orderData = {
      instrumentId: 1,
      side: 'BUY',
      size: 5,
      type: 'MARKET',
      userId: 999
    }

    const response = await request(app)
      .post('/api/order')
      .send(orderData)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      error: 'USER_NOT_FOUND'
    })
  })

  test('should return 404 when the instrument does not exist', async () => {
    const orderData = {
      instrumentId: 999,
      side: 'BUY',
      size: 5,
      type: 'LIMIT',
      price: 12,
      userId: 1
    }
  
    const response = await request(app)
      .post('/api/order')
      .send(orderData)
  
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      error: 'INSTRUMENT_NOT_FOUND'
    })
  })

  test('should return 400 when price is missing for a limit order', async () => {
    const orderData = {
      instrumentId: 1,
      side: 'BUY',
      size: 5,
      type: 'LIMIT',
      userId: 1,
    }
  
    const response = await request(app)
      .post('/api/order')
      .send(orderData)
  
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'PRICE_REQUIRED_FOR_LIMIT_ORDER'
    })
  })

  test('should return 400 for invalid (non-positive) instrumentId', async () => {
    const orderData = {
      instrumentId: -1,
      side: 'SELL',
      size: 2,
      type: 'MARKET',
      userId: 1,
    }
  
    const response = await request(app)
      .post('/api/order')
      .send(orderData)
  
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body).toEqual({
      error: 'INVALID_INSTRUMENT_ID'
    })
  })

  test('should return 400 for invalid size', async () => {
    const orderData = {
      instrumentId: 1,
      side: 'SELL',
      size: 2.5,
      type: 'MARKET',
      userId: 1,
    }
  
    const response = await request(app)
      .post('/api/order')
      .send(orderData)
  
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body).toEqual({
      error: 'INVALID_SIZE'
    })
  })
  
  test('should return 201 and create a filled buy order for a MARKET type', async () => {
    const orderData = {
      instrumentId: 1,
      side: 'BUY',
      size: 5,
      type: 'MARKET',
      userId: 1,
    }
  
    const mockOrder = {
      id: expect.any(Number),
      instrumentId: { id: 1 },
      userId: { id: 1 },
      side: 'BUY',
      size: 5,
      type: 'MARKET',
      price: '260.00',
      status: 'FILLED',
      dateTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
    }
  
    const response = await request(app)
      .post('/api/order')
      .send(orderData)
  
    expect(response.statusCode).toBe(201)
    expect(response.body.order).toMatchObject(mockOrder)
  })
  
  test('should return 201 and create a new sell order for a LIMIT type', async () => {
    const orderData = {
      instrumentId: 1,
      side: 'SELL',
      size: 10,
      type: 'LIMIT',
      userId: 1,
      price: 270,
    }

    const response = await request(app)
      .post('/api/order')
      .send(orderData)

    const mockOrder = {
      id: expect.any(Number),
      instrumentId: { id: 1 },
      userId: { id: 1 },
      side: 'SELL',
      size: 10,
      type: 'LIMIT',
      price: '270',
      status: 'NEW',
      dateTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
    }

    expect(response.statusCode).toBe(201)
    expect(response.body.order).toMatchObject(mockOrder)
  })
})
