import { IOrder } from '../entity/Order'

export function fifo(buyOrders: IOrder[], sellOrders: IOrder[]): IOrder[] {
  const remainingBuyOrders: IOrder[] = []
  let sellIndex = 0
  let buyIndex = 0

  while (sellIndex < sellOrders.length && buyIndex < buyOrders.length) {
    const currentSellOrder = sellOrders[sellIndex]
    let currentBuyOrder = buyOrders[buyIndex]

    if (currentBuyOrder.size === currentSellOrder.size) {
      buyIndex++
      sellIndex++
    } else if (currentBuyOrder.size > currentSellOrder.size) {
      currentBuyOrder.size -= currentSellOrder.size
      sellIndex++
    } else {
      currentSellOrder.size -= currentBuyOrder.size
      buyIndex++
    }
  }

  for (let i = buyIndex; i <buyOrders.length; i++) {
    remainingBuyOrders.push(buyOrders[i])
  }

  return remainingBuyOrders
}

export const roi = (currentValue: number, originalCost: number) => (((currentValue - originalCost) / originalCost) * 100)