import { z } from 'zod'
import { getLastPrice } from '../utils/instrument'
import { OrderSide, OrderType, OrderStatus } from '../enums/order'
import { CustomErrorCodeEnum } from '../enums/http'
import moment from 'moment'

const positiveNumberWithCode = (field: string, code: CustomErrorCodeEnum) =>
  z.number().positive({ message: code }).int({ message: code })

export const OrderCreateSchema = z.object({
  instrumentId: positiveNumberWithCode('Instrument ID', CustomErrorCodeEnum.INVALID_INSTRUMENT_ID),
  side: z.nativeEnum(OrderSide, { errorMap: () => ({ message: CustomErrorCodeEnum.INVALID_ORDER_SIDE }) }),
  size: positiveNumberWithCode('Size', CustomErrorCodeEnum.INVALID_SIZE),
  price: z.number().positive({ message: CustomErrorCodeEnum.INVALID_PRICE }).optional(),
  type: z.nativeEnum(OrderType, { errorMap: () => ({ message: CustomErrorCodeEnum.INVALID_ORDER_TYPE }) }),
  userId: positiveNumberWithCode('User ID', CustomErrorCodeEnum.INVALID_USER_ID),
  status: z.nativeEnum(OrderStatus).optional(),
  dateTime: z.string().date().optional()
}).superRefine(async (order, ctx) => {
  if ((order.side === OrderSide.BUY || order.side === OrderSide.SELL) && order.type === OrderType.MARKET) {
    const price = await getLastPrice(order.instrumentId)
    order.price = price?.close
    if (!order.price) {
      ctx.addIssue({
        code: "custom",
        path: ['instrumentId'],
        message: CustomErrorCodeEnum.INSTRUMENT_NOT_FOUND
      })
    }
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

  const currentDate = moment()
  order.dateTime = currentDate.format('YYYY-MM-DD')
})

export const createOrderSchema = z.object({
  body: OrderCreateSchema,
  query: z.object({}),
  params: z.object({})
})

export type ICreateOrderSchema = z.infer<typeof createOrderSchema>
