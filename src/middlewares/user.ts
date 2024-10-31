import { NextFunction, Response, Request } from 'express'
import { AppDataSource } from '../config/db'
import { User } from '../entity/User'
import { OrderParams } from '../interfaces/order'
import { userHasSufficientActionInstruments, userHasSufficientPesos } from '../utils/user'

export const validateUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.body

  if (!userId) {
    res.status(400).json({ error: 'The userId parameter is required.' })
    return
  }

  try {
    const userRepository = AppDataSource.getRepository(User)

    const user = await userRepository.findOne({ where: { id: parseInt(userId) } })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const validateFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const order: OrderParams = req.body
  const { userId, size, price, side, instrumentId } = order

  if (!userId) return

  try {
    const hasSufficientFunds = (side === 'BUY')
      ? await userHasSufficientPesos(userId, size * price)
      : await userHasSufficientActionInstruments(userId, instrumentId, size)

     if (!hasSufficientFunds) req.body.status = 'REJECTED'

    return next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}