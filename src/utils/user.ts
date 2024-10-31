import { AppDataSource } from '../config/db'
import { Order } from '../entity/Order'

export async function userHasSufficientActionInstruments(
  userId: number,
  instrumentId: number,
  size: number
): Promise<boolean> {
  const orderRepository = AppDataSource.getRepository(Order)

  const result = await orderRepository
    .createQueryBuilder('o')
    .select(`SUM(CASE WHEN o.side = 'BUY' THEN o.size ELSE -o.size END)`, 'balance')
    .where('o.userId = :userId', { userId })
    .andWhere('o.instrumentId = :instrumentId', { instrumentId })
    .andWhere('o.status = :status', { status: 'FILLED' })
    .getRawOne()

  return result?.balance >= size
}

export async function userHasSufficientPesos(userId: number, pesosNeed: number): Promise<boolean> {
  const orderRepository = AppDataSource.getRepository(Order)
  const result = await orderRepository
    .createQueryBuilder("o")
    .select(`
      CAST(
        SUM(
          CASE
            WHEN o.side = 'CASH_IN' THEN COALESCE(o.size, 0) * COALESCE(o.price, 0)
            WHEN o.side = 'CASH_OUT' THEN -COALESCE(o.size, 0) * COALESCE(o.price, 0)
            WHEN o.side = 'BUY' THEN -COALESCE(o.size, 0) * COALESCE(o.price, 0)
            WHEN o.side = 'SELL' THEN COALESCE(o.size, 0) * COALESCE(o.price, 0)
            ELSE 0
          END
        ) AS FLOAT
      ) AS balance
    `)
    .where('o.status = :status', { status: 'FILLED' })
    .andWhere('o.userId = :userId', { userId })
    .getRawOne()

  return result?.balance >= pesosNeed
}