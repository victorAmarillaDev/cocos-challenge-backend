import { Router } from 'express'
import InstrumentsController from '../controllers/instrument'

const router = Router()

router.get('/search', InstrumentsController.getInstruments )

export default router