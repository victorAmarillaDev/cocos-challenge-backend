import { z } from 'zod'

export const ParamsUserIdSchema = z.object({
  userId: z.string().regex(/^\d+$/, 'userId must be a valid numeric string').transform(Number),
})

export const OrderCreateSchema = z.object({
  instrumentId: z.number().positive().int(),
  side: z.enum(['BUY', 'SELL', 'CASH_IN', 'CASH_OUT']),
  size: z.number().positive().int(),
  price: z.number().positive().optional(),
  type: z.enum(['LIMIT', 'MARKET']),
  status: z.enum(['NEW', 'FILLED', 'REJECTED', 'CANCELLED'])
})


export const EnhancedOrderSchema = OrderCreateSchema.refine(
  (order) => {
    console.log(order)
    if (order.type === 'LIMIT' && !order.price) return false
    if (order.type === 'MARKET' && order.status !== 'FILLED') return false
    if (order.side === 'SELL' && !order.instrumentId) return false
    return true
  },
  {
    message: 'Invalid order structure',
  }
)

