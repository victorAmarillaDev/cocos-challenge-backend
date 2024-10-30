import { NextFunction, Response, Request } from 'express'
import { AppDataSource } from '../config/db'
import { User } from '../entity/User'
import { OrderParams } from '../interfaces/order'
import { userHasSufficientActionInstruments, userHasSufficientPesos } from '../utils/user'
import { getLastPrice } from '../utils/instrument'

interface UserRequest extends Request {
  params: {
    userId?: string
  }
}

export const validateUserExists = async (req: UserRequest, res: Response, next: NextFunction) : Promise<void> => {
  const { userId } = req.params

  if (!userId) {
    res.status(400).json({ error: 'The userId parameter is required.' })
    return 
  }

  try {
    const userRepository = AppDataSource.getRepository(User)

    const user = await userRepository.findOne({ where: {id: parseInt(userId) } })

    if (!user) {
      res.status(404).json({ error: 'User not found'})
      return
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const validateFunds = async(req: UserRequest, res: Response, next: NextFunction) : Promise<void> => {
  const order: OrderParams = req.body
  const userId = req.params.userId

  if (!userId){
    return
  }


  if (order.side === 'BUY') {

    let priceInstrument: number | undefined = order.price

    if (order.type === 'MARKET') {
      const instrument = await getLastPrice(order.instrumentId)

      if (!instrument) {
        res.status(404).json({ error: 'Instrument not found.' })
        return
      }

      priceInstrument = Number(instrument.close)
    }

    const pesosNeed = order.size * priceInstrument

    const isUserHasSufficientPesos = await userHasSufficientPesos(Number(userId), pesosNeed)

    if (isUserHasSufficientPesos) next()
    res.status(404).json({ error: 'Insufficient funds' })
    return
  }


  if (order.side === 'SELL') {
    const isUserHasSufficientActionInstruments = await userHasSufficientActionInstruments(
      order.userId,
      order.instrumentId,
      order.size
    )

    if (isUserHasSufficientActionInstruments) next()
    res.status(404).json({ error: 'Insufficient funds' })
    return
  }

}