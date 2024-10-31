import { Request, Response, NextFunction } from 'express'
import Zod from 'zod'

export const requestValidator = async <T extends Zod.Schema<{ body: any }>>
(req: Request, res: Response, next: NextFunction, schema: T): Promise<void> => {
  const body = req.body

  try {
    const validatedRequest = await schema.parseAsync({ body })

    req.body = validatedRequest.body

    next()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
    return
  }

}
