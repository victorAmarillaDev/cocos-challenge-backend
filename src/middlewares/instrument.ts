import { Request, Response, NextFunction } from 'express'
import { querySearchInstrumentsValidator } from './requestValidator'
import { searchQueryInstrumentSchema } from '../schemas/instrument'

export const validatorQueryParameters = (req: Request, res: Response, next: NextFunction): void => {
  querySearchInstrumentsValidator<typeof searchQueryInstrumentSchema>(req, res, next, searchQueryInstrumentSchema)
}