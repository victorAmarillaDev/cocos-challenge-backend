import { Router } from 'express'
import portfolioRouter from './portfolio'
import instrumentsRoutes from './instrument'
import ordersRoutes from './order'

const router = Router()

router.use('/portfolio', portfolioRouter)
router.use('/instrument', instrumentsRoutes)
router.use('/order', ordersRoutes)

export default router