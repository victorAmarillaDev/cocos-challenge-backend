import { Request, Response, NextFunction } from 'express'
import { requestValidator } from './requestValidator'
import { searchQueryInstrumentSchema } from '../schemas/instrument'

export const validatorQueryParameters = (req: Request, res: Response, next: NextFunction): void => {
  requestValidator<typeof searchQueryInstrumentSchema>(req, res, next, searchQueryInstrumentSchema)
}