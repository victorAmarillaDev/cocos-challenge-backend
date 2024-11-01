import { AppDataSource } from '../config/db'
import {  IOrder, Order, IOrderCreate } from '../entity/Order'

class OrderService {
  private orderRepository = AppDataSource.getRepository(Order)

  public async createOrder(order: Omit<IOrder, 'instrumentId' | 'userId'> & {
    instrumentId: number,
    userId: number
  }) {
    const { userId, instrumentId, ...orderData } = order

    const newOrder: IOrderCreate = {
      ...orderData,
      instrumentId: { id: instrumentId },
      userId: { id: userId },
      price: order.price.toString()
    }

    return this.orderRepository.save(newOrder)
  }
}

export default new OrderService()
