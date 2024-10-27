import { AppDataSource } from '../config/db'
import { Instrument } from '../entity/Instrument'
import { MarketData } from '../entity/Marketdata'
import { Order } from '../entity/Order'
import lodash from 'lodash'

interface OrderWithMarketData extends Omit<Order, 'instrumentId'> {
  instrumentId: Instrument & {
    marketdata?: MarketData | null;
  }
}

interface Portfolio {
  totalAccountValue: number
  availablePesos: number
  assets: OrderWithMarketData[]
}

class PortfolioService {
  private ordersRepository = AppDataSource.getRepository(Order)

  private getAvailablePesos(orders: OrderWithMarketData[]): number {
    return lodash.chain(orders)
      .sumBy((order: OrderWithMarketData) => {
        const size = order.size
        const price = parseFloat(order.price) || 0
        const orderValue = size * price

        switch (order.side) {
          case 'CASH_IN':
            return orderValue
          case 'CASH_OUT':
          case 'BUY':
            return -orderValue
          case 'SELL':
            return orderValue
          default:
            return 0
        }
      })
      .value()
  }

  private async getOrdersByUserWithMarketData(userId: number): Promise<OrderWithMarketData[]> {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.instrumentId', 'instrument')
      .leftJoinAndMapOne(
        'instrument.marketdata',
        'MarketData',
        'marketdata',
        `marketdata.instrumentId = instrument.id AND marketdata.date = (
          SELECT MAX(m.date) 
          FROM marketdata m 
          WHERE m.instrumentId = instrument.id
        )`
      )
      .where('order.userId = :userId', { userId })
      .andWhere('order.status = :status', { status: 'FILLED' })
      .getMany()
  }

  private getTotalBalance(orders: OrderWithMarketData[]) {
    return lodash.chain(orders)
    .filter(order => ((order.side === 'BUY' || order.side == 'SELL') && order.instrumentId.type === 'ACCIONES'))
    .sumBy(order => {
      const size = order.size
      const closePrice = order.instrumentId.marketdata?.close || 0
      return size * closePrice
    })
    .value()
  }

  public async getPortfolio(userId: number): Promise<Portfolio | undefined> {
    try {
      const assets = await this.getOrdersByUserWithMarketData(userId)

      const availablePesos: number = this.getAvailablePesos(assets)

      const marketStockValue: number = this.getTotalBalance(assets)

      return {
        totalAccountValue: marketStockValue + availablePesos,
        availablePesos,
        assets,
      }
    } catch (error) {
      console.log(error)
      return undefined
    }
  }
}

export default new PortfolioService()
