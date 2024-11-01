import { z } from 'zod'
import { getLastPrice } from '../utils/instrument'
import { OrderSide, OrderType, OrderStatus } from '../enums/order'
import { CustomErrorCodeEnum } from '../enums/http'

export const OrderCreateSchema = z.object({
  instrumentId: z.number().positive().int(),
  side: z.nativeEnum(OrderSide),
  size: z.number().positive().int(),
  price: z.number().positive().optional(),
  type: z.nativeEnum(OrderType),
  userId: z.number().positive().int(),
  status: z.nativeEnum(OrderStatus).optional()
}).superRefine(async (order, ctx) => {

  if ((order.side === OrderSide.BUY || order.side === OrderSide.SELL) && order.type === OrderType.MARKET) {
    const price = await getLastPrice(order.instrumentId)
    if (!price) {
      ctx.addIssue({
        code: "custom",
        path: ['instrumentId'],
        message: CustomErrorCodeEnum.INSTRUMENT_NOT_FOUND
      })
    }
    order.price = price?.close
    order.status = OrderStatus.FILLED
  }

  if (order.type === OrderType.LIMIT) {
    order.status = OrderStatus.NEW
  }

  if (order.type === OrderType.LIMIT && !order.price) {
    ctx.addIssue({
      code: "custom",
      path: ['price'],
      message: CustomErrorCodeEnum.PRICE_REQUIRED_FOR_LIMIT_ORDER
    })
  }
})

export const createOrderSchema = z.object({
  body: OrderCreateSchema,
})

export type ICreateOrderSchema = z.infer<typeof createOrderSchema>
