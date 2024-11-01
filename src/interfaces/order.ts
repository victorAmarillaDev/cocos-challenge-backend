import { IOrder } from '../entity/Order'

export type IOrderData = Omit<IOrder, 'instrumentId' | 'userId'> & {
  instrumentId: number,
  userId: number
}