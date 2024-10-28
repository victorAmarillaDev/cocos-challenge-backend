import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata"

import app from './app'
import { AppDataSource } from './config/db'

async function main(){
  try {
    dotenv.config()
    await AppDataSource.initialize()
    app.listen(process.env.PORT)

    console.log('Server is listening on port', process.env.PORT)
  } catch (error) {
    console.log(error)
  }
}

main()