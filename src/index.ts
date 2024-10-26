import "reflect-metadata"

import dotenv from "dotenv"
import app from './app'


dotenv.config();

app.listen()

console.log('Server is listening on port', process.env.PORT)
