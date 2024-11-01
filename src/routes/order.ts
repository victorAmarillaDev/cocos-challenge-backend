import { Router } from 'express'
import { validateUserAndFunds } from '../middlewares/user'
import OrderController from '../controllers/order'
import { validateOrderRequest } from '../middlewares/order'

const router = Router()

router.post('/', validateOrderRequest, validateUserAndFunds, OrderController.createOrder)

export default router