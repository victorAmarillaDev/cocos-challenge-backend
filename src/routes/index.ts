import { Router } from 'express'
import usersRouter from './users'
import assetsRoutes from './assets'
import ordersRoutes from './orders'

const router = Router()

router.use('/user', usersRouter)
router.use('/assets', assetsRoutes)
router.use('/orders', ordersRoutes)

export default router