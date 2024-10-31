import { Order } from '../entity/Order'

export interface MarketOrderParams {
  userId: number
  instrumentId: number
  side: 'BUY' | 'SELL'
  size: number
  type: 'MARKET'
}

export interface OrderParams {
  userId: number
  instrumentId: number
  side: 'BUY' | 'SELL'
  size: number
  price: number
  type: 'LIMIT' | 'MARKET'
  status: 'NEW' | 'FILLED'
}

export type LimitOrderResponse = Order & {
  status: 'NEW'
  type: 'LIMIT'
  side: 'BUY' | 'SELL'
}