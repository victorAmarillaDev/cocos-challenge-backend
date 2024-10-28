import express, { json } from "express"
import morgan from 'morgan'
import cors from 'cors'
import router from './routes'

const app = express()

app.use(json())
app.use(morgan('dev'))
app.use(cors())
app.use('/api', router)

export default app