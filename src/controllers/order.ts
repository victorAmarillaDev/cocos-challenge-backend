import { Request, Response } from 'express'
import OrderService from '../services/order'
import { IOrderData } from '../interfaces/order'
import { ErrorCodeEnum, StatusCodeEnum } from '../enums/http'


class OrderController {
  static async createOrder(req: Request, res: Response) {
    const orderData: IOrderData = req.body 

    try {
      const newOrder = await OrderService.createOrder(orderData)

      res.status(StatusCodeEnum.CREATED).json({ order: newOrder })
      return
    } catch (error: any) {
      res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
    }
  }
}

export default OrderController
