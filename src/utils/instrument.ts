import { FindOptionsWhere } from 'typeorm'
import { AppDataSource } from '../config/db'
import { MarketData } from '../entity/Marketdata'

const marketDataRepository = AppDataSource.getRepository(MarketData)

export async function getLastPrice(id: number): Promise<MarketData | null> {
  const whereOptions: FindOptionsWhere<MarketData> = { instrumentId: { id } }

  const instrumentData = await marketDataRepository.findOne({
    where: whereOptions,
    select: ['id', 'close']
  })

  return instrumentData
}