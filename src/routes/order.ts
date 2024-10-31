import { Router } from 'express'
import { validateFunds, validateUserExists } from '../middlewares/user'
import OrderController from '../controllers/order'
import { validateOrderRequest } from '../middlewares/order'

const router = Router()

router.post('/', validateOrderRequest, validateUserExists, validateFunds, OrderController.createOrder)

export default router