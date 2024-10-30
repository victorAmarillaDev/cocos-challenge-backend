import { AppDataSource } from '../config/db'
import { Instrument } from '../entity/Instrument'
import { MarketData } from '../entity/Marketdata'
import { Order } from '../entity/Order'
import lodash from 'lodash'

interface OrderWithMarketData extends Omit<Order, 'instrumentId'> {
  instrumentId: Instrument & {
    marketdata?: MarketData | null
  }
}

interface assetsResponse extends Instrument {
  quantity: number,
  totalValue: number,
  performance: number
}

interface Portfolio {
  totalAccountValue: number
  availablePesos: number
  assets: assetsResponse[]
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
      .filter(order => 
        (order.side === 'BUY' || order.side === 'SELL') && 
        order.instrumentId.type === 'ACCIONES'
      )
      .groupBy(order => order.instrumentId.ticker)
      .map((orders) => {
        const marketData = orders[0].instrumentId.marketdata
        const closePrice = marketData?.close || 0
  
        const totalQuantity = lodash.sumBy(orders, order =>
          order.side === 'BUY' ? order.size : -order.size
        )

        return totalQuantity * closePrice
      })
      .filter(balance => balance > 0)
      .sum()
      .value()
  }
  
  private getAssets(orders: OrderWithMarketData[]): assetsResponse[] {
    const assets = lodash.chain(orders)
      .filter(order => (order.side === 'BUY' || order.side === 'SELL') && order.instrumentId.type === 'ACCIONES')
      .groupBy(order => order.instrumentId.ticker)
      .map((listOrder) => {
        const { ticker, name, type, id } = listOrder[0].instrumentId
  
        const totalBought = lodash.sumBy(listOrder.filter(o => o.side === 'BUY'), order => order.size)
        const totalSold = lodash.sumBy(listOrder.filter(o => o.side === 'SELL'), order => order.size)
        const quantity = totalBought - totalSold
  
        if (quantity <= 0) return null
  
        const currentClosePrice = listOrder[0].instrumentId.marketdata?.close ?? 0
        const currentValue = quantity * currentClosePrice
  
        // Método FIFO
        let remainingQuantity = quantity
        let totalPurchaseValue = 0
  
        for (const order of listOrder.filter(o => o.side === 'BUY')) {
          if (remainingQuantity <= 0) break
  
          const buyQuantity = Math.min(order.size, remainingQuantity)
          
          totalPurchaseValue += buyQuantity * parseFloat(order.price)
          remainingQuantity -= buyQuantity
        }
  
        const performance = totalPurchaseValue > 0 
          ? ((currentValue - totalPurchaseValue) / totalPurchaseValue) * 100 
          : 0
  
        return {
          id,
          ticker,
          name,
          type,
          quantity,
          totalValue: currentValue,
          performance
        }
      })
      .filter(stock => stock !== null)
      .value() as assetsResponse[]
  
    return assets
  }

  public async getPortfolio(userId: number): Promise<Portfolio | undefined> {
    try {
      const assets = await this.getOrdersByUserWithMarketData(userId)

      const availablePesos: number = this.getAvailablePesos(assets)

      const marketStockValue: number = this.getTotalBalance(assets)

      const listAssets = this.getAssets(assets)

      return {
        totalAccountValue: marketStockValue + availablePesos,
        availablePesos,
        assets: listAssets,
      }
    } catch (error) {
      console.log(error)
      return undefined
    }
  }
}

export default new PortfolioService()