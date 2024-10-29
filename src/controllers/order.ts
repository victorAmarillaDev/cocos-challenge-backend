import { Request, Response } from 'express'
import OrderService from '../services/order'


class OrderController {
  static async createOrder(req: Request, res: Response) {
    const userId = parseInt(req.params.userId)
    const order = req.body

    try {

      await OrderService.createOrder({ userId, ...order })

      res.status(200).json({  })

    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default OrderController