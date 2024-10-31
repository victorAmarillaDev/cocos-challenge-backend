import { z } from 'zod'
import { getLastPrice } from '../utils/instrument'

export const OrderCreateSchema = z.object({
  instrumentId: z.number().positive().int(),
  side: z.enum(['BUY', 'SELL', 'CASH_IN', 'CASH_OUT']),
  size: z.number().positive().int(),
  price: z.number().positive().optional(),
  type: z.enum(['LIMIT', 'MARKET']),
  userId: z.number().positive().int(),
  status: z.enum(['NEW', 'FILLED', 'REJECTED', 'CANCELLED']).optional()
}).superRefine(async (order, ctx) => {

  if ((order.side === 'BUY' || order.side === 'SELL') && order.type === 'MARKET') {
    const price = await getLastPrice(order.instrumentId)
    if (!price) {
      ctx.addIssue({
        code: "custom",
        path: ['Instrument'],
        message: 'Instrument not found'
      })
    }
    order.price = price?.close
    order.status = 'FILLED'
  }

  if (order.type === 'LIMIT') {
    order.status = 'NEW'
  }

  if (order.type === 'LIMIT' && !order.price) {
    ctx.addIssue({
      code: "custom",
      path: ['Price'],
      message: 'Price is required for LIMIT orders'
    })
  }
})

export const createOrderSchema = z.object({
  body: OrderCreateSchema,
})

export type ICreateOrderSchema = z.infer<typeof createOrderSchema>
