import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Instrument } from './Instrument'
import { User } from './User'
import { OrderType, OrderSide, OrderStatus } from '../enums/order'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Instrument, (instrument) => instrument.id)
  @JoinColumn({ name: 'instrumentid' })
  instrumentId: Instrument

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userid' })
  userId: User

  @Column()
  size: number

  @Column('decimal', { precision: 10, scale: 2 })
  price: string

  @Column({
    type: 'enum',
    enum: OrderType
  })
  type: OrderType

  @Column({
    type: 'enum',
    enum: OrderSide
  })
  side: OrderSide

  @Column({
    type: 'enum',
    enum: OrderStatus
  })
  status: OrderStatus

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', name: 'datetime'  })
  dateTime: Date
}

export type IOrder = InstanceType<typeof Order>
export type IOrderCreate = Omit<IOrder, 'instrumentId' | 'userId'> & {
  instrumentId: { id: number },
  userId: { id: number }
}