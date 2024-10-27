import { AppDataSource } from '../config/db'
import { Instrument } from '../entity/Instrument'
import { MarketData } from '../entity/Marketdata'
import { Order } from '../entity/Order'

interface Portfolio {
  totalAccountValue: number
  availablePesos: number
  assets: Asset[]
}

interface Asset {
  ticker: string
  name: string
  quantity: number
  totalValue: number
  totalReturn: number
}

class PortfolioService {
  private ordersRepository = AppDataSource.getRepository(Order)
  private marketDataRepository = AppDataSource.getRepository(MarketData)
  private instrumentsRepository = AppDataSource.getRepository(Instrument)

  private async getAvailablePesos(userId: number): Promise<number> {
    const result = await this.ordersRepository.createQueryBuilder("o")
      .select(
        `CAST(
          SUM(
            CASE
              WHEN o.side = 'CASH_IN' THEN COALESCE(o.size, 0) * COALESCE(o.price, 0)
              WHEN o.side = 'CASH_OUT' THEN -COALESCE(o.size, 0) * COALESCE(o.price, 0)
              WHEN o.side = 'BUY' THEN -COALESCE(o.size, 0) * COALESCE(o.price, 0)
              WHEN o.side = 'SELL' THEN COALESCE(o.size, 0) * COALESCE(o.price, 0)
              ELSE 0
            END
          ) AS FLOAT
        ) AS balance`
      )
      .where('o.status = :status', { status: 'FILLED' })
      .andWhere('o.userId = :userId', { userId })
      .getRawOne();

    return result.balance || 0;
  }

  

  public async getPortfolio(userId: number) {
    try {

      const availablePesos = this.getAvailablePesos(userId)
    

      return Promise.resolve({
        totalAccountValue: 100000,
        availablePesos,
        assets: [
          {
            ticker: 'AAPL',
            name: 'Apple Inc.',
            quantity: 10,
            totalValue: 15000,
            totalReturn: 2000
          },
          {
            ticker: 'TSLA',
            name: 'Tesla Inc.',
            quantity: 5,
            totalValue: 25000,
            totalReturn: 5000
          },
          {
            ticker: 'MSFT',
            name: 'Microsoft Corp.',
            quantity: 8,
            totalValue: 30000,
            totalReturn: 3500
          }
        ]
      })

    } catch (error) {
      console.log(error)
    }

  }
}

export default new PortfolioService()
