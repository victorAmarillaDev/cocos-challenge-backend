import { Router } from 'express'
import InstrumentsController from '../controllers/instrument'
import { validatorQueryParameters } from '../middlewares/instrument'

const router = Router()

router.get('/search', validatorQueryParameters, InstrumentsController.getInstruments)

export default router