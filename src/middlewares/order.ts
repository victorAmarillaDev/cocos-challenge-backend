import { Request, Response, NextFunction } from 'express'
import { createOrderSchema } from '../schemas/order'
import { requestValidator } from './requestValidator'

export const validateOrderRequest = (req: Request, res: Response, next: NextFunction): void => {
  requestValidator<typeof createOrderSchema>(req, res, next, createOrderSchema)
}
