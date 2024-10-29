import { Request, Response } from 'express'
import InstrumentsService from '../services/instrument'

class InstrumentsController {
  static async getInstruments(req: Request, res: Response) {

    const { ticker, name } = req.query as Record<string, string | undefined>

    try {
      const instruments = await InstrumentsService.getSimilarInstruments(ticker, name)

      res.status(200).json({ instruments })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default InstrumentsController
