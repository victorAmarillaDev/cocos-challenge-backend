import { Request, Response } from 'express'
import portfolioService from '../services/portfolio'
import { ErrorCodeEnum, StatusCodeEnum } from '../enums/http'

class PortfolioController {
  static async getPortfolio(req: Request, res: Response) {
    const userId = req.params.userId as unknown as number

    try {

      const portfolio = await portfolioService.getPortfolio(userId)

      res.status(StatusCodeEnum.OK).json({ portfolio })

    } catch (error) {
      res.status(StatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: ErrorCodeEnum.INTERNAL_SERVER_ERROR })
    }
  }
}

export default PortfolioController
