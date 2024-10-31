import { Request, Response } from 'express'
import OrderService from '../services/order'


class OrderController {
  static async createOrder(req: Request, res: Response) {
    const orderData = req.body 

    try {
      const newOrder = await OrderService.createOrder(orderData)

      res.status(200).json({ order: newOrder })
      return
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default OrderController
