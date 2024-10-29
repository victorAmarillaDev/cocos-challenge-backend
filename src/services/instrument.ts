import { FindOptionsWhere, ILike } from 'typeorm'
import { AppDataSource } from '../config/db'
import { Instrument } from '../entity/Instrument'


type InstrumentsResponse = Instrument[]

class InstrumentsService {
  private instrumentRepository = AppDataSource.getRepository(Instrument)

  public async getSimilarInstruments(ticker: string | undefined, name: string | undefined) : Promise<InstrumentsResponse>  {
    
    const where : FindOptionsWhere <Instrument>[] = []

    if (ticker) {
      where.push({ ticker: ILike(`%${ticker.trim()}%`) })
    }

    //TODO: IGNORE TILDES
    if (name) {
      where.push({ name: ILike(`%${name.trim()}%`) })
    }

    return this.instrumentRepository.find({ where })

  }
  
}

export default new InstrumentsService()
