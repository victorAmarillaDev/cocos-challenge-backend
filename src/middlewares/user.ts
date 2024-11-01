import { NextFunction, Response, Request } from 'express'
import { checkUserExists, userHasSufficientActionInstruments, userHasSufficientPesos } from '../utils/user'
import { OrderSide, OrderStatus } from '../enums/order'
import { paramsUserSchema } from '../schemas/user'
import {  requestValidator } from './requestValidator'
import { CustomErrorCodeEnum, ErrorCodeEnum, StatusCodeEnum } from '../enums/http'

export const validateFunds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, size, price, side, instrumentId } = req.body

  try {

    const hasSufficientFunds = (side === OrderSide.BUY)
      ? await userHasSufficientPesos(userId, size * price)
      : await userHasSufficientActionInstruments(userId, instrumentId, size)

    if (!hasSufficientFunds) req.body.status = OrderStatus.REJECTED

    next()
  } catch (error) {
    res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
  }
}

export const validateParamsUser = (req: Request, res: Response, next: NextFunction): void => {
  requestValidator(req, res, next, paramsUserSchema)
}

export const validateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.userId as unknown as number

  try {
    const user = await checkUserExists(userId)

    if (!user) {
      res.status(StatusCodeEnum.NOT_FOUND).json({ error: CustomErrorCodeEnum.USER_NOT_FOUND })
      return
    }

    next()
  } catch (error) {
    res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
  }
}