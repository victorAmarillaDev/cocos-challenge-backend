import { Router } from 'express'
import portfolioRouter from './portfolio'
import assetsRoutes from './assets'
import ordersRoutes from './orders'

const router = Router()

router.use('/portfolio', portfolioRouter)
router.use('/assets', assetsRoutes)
router.use('/orders', ordersRoutes)

export default router