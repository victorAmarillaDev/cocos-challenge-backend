import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  email: string

  @Column({ length: 20 })
  accountNumber: string
}
