import { Request, Response } from 'express'
import portfolioService from '../services/portfolio'

class PortfolioController {
  static async getPortfolio(req: Request, res: Response) {
    const userId = req.params.userId as unknown as number

    try {

      const portfolio = await portfolioService.getPortfolio(userId)

      res.status(200).json({ portfolio })

    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default PortfolioController
