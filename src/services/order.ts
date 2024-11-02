import { AppDataSource } from '../config/db'
import { Order, IOrderCreate } from '../entity/Order'
import { IOrderData } from '../interfaces/order'

class OrderService {
  private orderRepository = AppDataSource.getRepository(Order)

  public async createOrder(order: IOrderData) {
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
