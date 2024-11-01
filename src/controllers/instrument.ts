import { Request, Response } from 'express'
import InstrumentsService from '../services/instrument'
import { ErrorCodeEnum, StatusCodeEnum } from '../enums/http'

class InstrumentsController {
  static async getInstruments(req: Request, res: Response) {

    const { ticker, name } = req.query as Record<string, string | undefined>

    try {
      const instruments = await InstrumentsService.getSimilarInstruments(ticker, name)

      res.status(StatusCodeEnum.OK).json({ instruments })
    } catch (error) {
      res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
    }
  }
}

export default InstrumentsController
