import { Router } from 'express'
import Portfolio from '../controllers/portfolio'
import { validateParamsUser, validateUser } from '../middlewares/user'

const router = Router()

router.get('/:userId', validateParamsUser, validateUser, Portfolio.getPortfolio)

export default router