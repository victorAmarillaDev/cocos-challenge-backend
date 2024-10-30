import { Request, Response, NextFunction } from 'express'
import { EnhancedOrderSchema, ParamsUserIdSchema } from '../schemas/order'

interface UserRequest extends Request {
  params: {
    userId?: string
  }
}

export const validateOrderRequest = (req: UserRequest, res: Response, next: NextFunction): void => {

  const paramsResult = ParamsUserIdSchema.safeParse(req.params)

  if (!paramsResult.success) {
    res.status(400).json({ error: paramsResult.error.errors.map((e) => e.message).join(', ') })
    return
  }



  const bodyResult = EnhancedOrderSchema.safeParse(req.body.order)

  if (!bodyResult.success) {
    res.status(400).json({ error: bodyResult.error.errors.map(e => e.message).join(', ') })
    return 
  }
  
  next()
}
