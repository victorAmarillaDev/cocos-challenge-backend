import { NextFunction, Response, Request } from 'express'
import { AppDataSource } from '../config/db'
import { User } from '../entity/User'
import { userHasSufficientActionInstruments, userHasSufficientPesos } from '../utils/user'
import { OrderSide, OrderStatus } from '../enums/order'
import { paramsUserSchema } from '../schemas/user'
import { paramsUserValidator } from './requestValidator'

export const validateUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.body

  try {
    const userRepository = AppDataSource.getRepository(User)

    const user = await userRepository.findOne({ where: { id: parseInt(userId) } })

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const validateFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const order = req.body

  const { userId, size, price, side, instrumentId } = order

  if (!userId) return

  try {
    const hasSufficientFunds = (side === OrderSide.BUY)
      ? await userHasSufficientPesos(userId, size * price)
      : await userHasSufficientActionInstruments(userId, instrumentId, size)

     if (!hasSufficientFunds) req.body.status = OrderStatus.REJECTED

    return next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

export const validateParamsUser = (req: Request, res: Response, next: NextFunction): void => {
  paramsUserValidator(req, res, next, paramsUserSchema)
}