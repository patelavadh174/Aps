import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPublicPartnership } from '../controllers/publicPartnershipController.js';

const router = Router();
router.get('/:slug', asyncHandler(getPublicPartnership));
export default router;
