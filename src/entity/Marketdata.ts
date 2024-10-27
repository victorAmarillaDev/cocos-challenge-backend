import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm'
import { Instrument } from './Instrument'

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  high: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  low: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  open: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  close: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  previousClose: number

  @Column('date')
  date: Date
}
