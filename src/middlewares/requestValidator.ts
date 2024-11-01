import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { IOrderData } from '../interfaces/order'
import { checkUserExists } from '../utils/user'

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
    res.status(400).json({ message: error.message })
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
      throw result.error
    }

    const userExists = await checkUserExists(result.data.params.userId)

    if (!userExists) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    req.params = result.data.params

    return next()
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
