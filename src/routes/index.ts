import { Router } from 'express'
import portfolioRouter from './portfolio'
import assetsRoutes from './instrument'
import ordersRoutes from './order'

const router = Router()

router.use('/portfolio', portfolioRouter)
router.use('/instrument', assetsRoutes)
router.use('/orders', ordersRoutes)

export default router