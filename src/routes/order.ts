import { Router } from 'express'
import { validateUserExists } from '../middlewares/user'
import OrderController from '../controllers/order'

const router = Router()

router.post('/:userId', validateUserExists, OrderController.createOrder)

export default router