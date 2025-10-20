import { Router } from 'express'
import * as biomarkerController from '../controllers/biomarkerController.js'

const router = Router()

// Get all biomarkers
router.get('/', biomarkerController.getBiomarkers)

// Get biomarker by date
router.get('/:date', biomarkerController.getBiomarkerByDate)

// Create or update biomarker
router.post('/', biomarkerController.upsertBiomarker)

// Delete biomarker
router.delete('/:id', biomarkerController.deleteBiomarker)

export default router

