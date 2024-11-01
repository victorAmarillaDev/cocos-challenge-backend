import { Router } from 'express'
import { validateFunds, validateUser } from '../middlewares/user'
import OrderController from '../controllers/order'
import { validateOrderRequest } from '../middlewares/order'
import { validateInstrument } from '../middlewares/instrument'

const router = Router()

router.post('/', validateOrderRequest, validateUser, validateInstrument, validateFunds, OrderController.createOrder)

export default router