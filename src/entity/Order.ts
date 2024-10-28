import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Instrument } from './Instrument'
import { User } from './User'

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

  @Column({ length: 10 })
  type: string

  @Column({ length: 10 })
  side: string

  @Column({ length: 20 })
  status: string

  @Column('timestamp')
  datetime: Date
}
