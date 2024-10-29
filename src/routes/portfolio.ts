import { Router } from 'express'
import Portfolio from '../controllers/portfolio'
import { validateUserExists } from '../middlewares/user'

const router = Router()

router.get('/:userId', validateUserExists, Portfolio.getPortfolio)

export default router