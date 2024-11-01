import { NextFunction, Response, Request } from 'express'
import { checkUserExists, userHasSufficientActionInstruments, userHasSufficientPesos } from '../utils/user'
import { OrderSide, OrderStatus } from '../enums/order'
import { paramsUserSchema } from '../schemas/user'
import { paramsUserValidator } from './requestValidator'

export const validateUserAndFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, size, price, side, instrumentId } = req.body

  try {
    const user = await checkUserExists(userId)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const hasSufficientFunds = (side === OrderSide.BUY)
      ? await userHasSufficientPesos(userId, size * price)
      : await userHasSufficientActionInstruments(userId, instrumentId, size)

    if (!hasSufficientFunds) req.body.status = OrderStatus.REJECTED

    next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const validateParamsUser = (req: Request, res: Response, next: NextFunction): void => {
  paramsUserValidator(req, res, next, paramsUserSchema)
}