
import { AppDataSource } from '../config/db'
import { MarketData } from '../entity/Marketdata'
import { Order } from '../entity/Order'
import { User } from '../entity/User'

interface OrderParams {
  userId: number
  instrumentId: number
  side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT'
  size: number
  price?: number
  type: 'MARKET' | 'LIMIT'
}

class OrderService {
  private orderRepository = AppDataSource.getRepository(Order)
  private marketDataRepo = AppDataSource.getRepository(MarketData)

  public async createOrder(order: OrderParams) {
    

  }
  
}

export default new OrderService()
