import { Router } from 'express'
import { validateFunds, validateUser } from '../middlewares/user'
import OrderController from '../controllers/order'
import { validateOrderRequest } from '../middlewares/order'

const router = Router()

router.post('/', validateOrderRequest, validateUser, validateFunds, OrderController.createOrder)

export default router