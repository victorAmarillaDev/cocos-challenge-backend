import { FindOptionsWhere } from 'typeorm'
import { AppDataSource } from '../config/db'
import { MarketData } from '../entity/Marketdata'
import { Instrument } from '../entity/Instrument'

const marketDataRepository = AppDataSource.getRepository(MarketData)
const instrumentRepository = AppDataSource.getRepository(Instrument)

export async function getLastPrice(id: number): Promise<MarketData | null> {
  const whereOptions: FindOptionsWhere<Pick<MarketData, 'instrumentId'>> = { instrumentId: { id } }

  const instrumentData = await marketDataRepository.findOne({
    where: whereOptions,
    select: ['id', 'close']
  })

  return instrumentData
}

export async function checkInstrumentExists(id: number) {
  return instrumentRepository.exists({
    where: { id }
  })
}