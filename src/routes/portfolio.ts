import { Router } from 'express'
import Portfolio from '../controllers/portfolio'
import { validateParamsUser } from '../middlewares/user'

const router = Router()

router.get('/:userId', validateParamsUser, Portfolio.getPortfolio)

export default router