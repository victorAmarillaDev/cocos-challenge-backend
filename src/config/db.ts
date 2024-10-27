import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { Order } from '../entity/Order'
import { MarketData } from '../entity/Marketdata'
import { Instrument } from '../entity/Instrument'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User, Order, MarketData, Instrument],
  subscribers: [],
  migrations: []
})
