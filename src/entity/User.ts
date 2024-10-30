import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 255 })
  email: string

  @Column({ name: 'accountnumber', length: 20 })
  accountNumber: string
}
