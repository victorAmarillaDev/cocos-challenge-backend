import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { ErrorCodeEnum, StatusCodeEnum } from '../enums/http'

export const requestValidator = async <T extends ZodSchema<{ body?: any, params?: any, query?: any }>>(
  req: Request,
  res: Response,
  next: NextFunction,
  schema: T,
  isAsync?: boolean
): Promise<void> => {

  const body = req.body
  const params = req.params
  const query = req.query

  try {
    
    const validatedRequest = isAsync ? await schema.parseAsync({ body, params, query }) : schema.parse({ body, params, query })

    req.body = validatedRequest.body
    req.params = validatedRequest.params
    req.query = validatedRequest.query

    next()
  } catch (error: any) {
    res.status(StatusCodeEnum.BAD_REQUEST).json({ message: ErrorCodeEnum.BAD_REQUEST, description: error.message })
    return
  }
}
