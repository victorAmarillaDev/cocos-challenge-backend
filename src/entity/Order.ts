import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm'
import { Instrument } from './Instrument'
import { User } from './User'

@Entity('orders')
export class Order  extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  size: number

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column({ length: 10 })
  type: string

  @Column({ length: 10 })
  side: string

  @Column({ length: 20 })
  status: string

  @Column('timestamp')
  datetime: Date
}
