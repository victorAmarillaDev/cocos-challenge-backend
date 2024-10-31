import { AppDataSource } from '../config/db'
import { Order } from '../entity/Order'
import { OrderParams } from '../interfaces/order'
import { DeepPartial } from 'typeorm'

class OrderService {
  private orderRepository = AppDataSource.getRepository(Order)

  public async createOrder(order: OrderParams) {
    const { userId, instrumentId, ...orderData } = order

    const newOrder: DeepPartial<Order> = {
      ...orderData,
      instrumentId: { id: instrumentId },
      userId: { id: userId },
      price: order.price.toString(),
      datetime: new Date()
    }

    return this.orderRepository.save(newOrder)

  }
  
}

export default new OrderService()
