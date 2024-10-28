import { Router } from 'express'
import Portfolio from '../controllers/Portfolio'

const router = Router()

router.get('/:userId', Portfolio.getPortfolio)

export default router