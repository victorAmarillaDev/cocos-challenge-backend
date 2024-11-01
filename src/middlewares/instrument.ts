import { Request, Response, NextFunction } from 'express'
import { requestValidator } from './requestValidator'
import { searchQueryInstrumentSchema } from '../schemas/instrument'
import { checkInstrumentExists } from '../utils/instrument'
import { CustomErrorCodeEnum, ErrorCodeEnum, StatusCodeEnum } from '../enums/http'

export const validatorQueryParameters = (req: Request, res: Response, next: NextFunction): void => {
  requestValidator<typeof searchQueryInstrumentSchema>(req, res, next, searchQueryInstrumentSchema)
}

export const validateInstrument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const instrumentId = req.body.instrumentId as unknown as number

  try {
    const instrument = await checkInstrumentExists(instrumentId)

    if (!instrument) {
      res.status(StatusCodeEnum.NOT_FOUND).json({ error: CustomErrorCodeEnum.INSTRUMENT_NOT_FOUND })
      return
    }

    next()
  } catch (error) {
    res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
  }
}