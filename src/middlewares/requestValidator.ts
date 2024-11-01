import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { IOrderData } from '../interfaces/order'
import { checkUserExists } from '../utils/user'
import { ErrorCodeEnum, StatusCodeEnum } from '../enums/http'

export const requestValidator = async <T extends ZodSchema<{ body: any }>>(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: T
): Promise<void> => {

  const body: Omit<IOrderData, 'status' | 'price' | 'dateTime'> & {
    price?: string
  } = req.body

  try {
    const validatedRequest = await schema.parseAsync({ body })

    req.body = validatedRequest.body

    next()
  } catch (error: any) {
    res.status(StatusCodeEnum.BAD_REQUEST).json({ message: ErrorCodeEnum.BAD_REQUEST, description: error.message })
    return
  }
}

export const paramsUserValidator = async <T extends ZodSchema<{ params: any }>>(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: T
): Promise<void> => {
  try {

    const result = schema.safeParse(req)

    if (!result.success) {
      res.status(StatusCodeEnum.BAD_REQUEST).json({ message: ErrorCodeEnum.BAD_REQUEST, description: result.error })
      return
    }

    const userExists = await checkUserExists(result.data.params.userId)

    if (!userExists) {
      res.status(StatusCodeEnum.NOT_FOUND).json({ message: ErrorCodeEnum.BAD_REQUEST, description: 'User' })
      return
    }

    req.params = result.data.params

    return next()
  } catch (error: any) {
    res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ message: ErrorCodeEnum.INTERNAL_SERVER_ERROR})
  }
}

export const querySearchInstrumentsValidator = async <T extends ZodSchema<{ query: any }>>(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: T
): Promise<void> => {
  try {
    const result = schema.safeParse(req)

    if (!result.success) {
      res.status(StatusCodeEnum.BAD_REQUEST).json({ error: ErrorCodeEnum.BAD_REQUEST, message: result.error })
      return
    }

    req.query = result.data.query

    return next()
  } catch (error) {
    res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
  }
}
