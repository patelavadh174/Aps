import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { enrollCsv, listBatches, revokeBatch, uploadCsv } from '../controllers/enrollmentController.js';

const router = Router();
router.use(requireAuth, requireRoles('admin', 'hbt_admin'));
router.get('/batches', asyncHandler(listBatches));
router.post('/upload', uploadCsv.single('file'), asyncHandler(enrollCsv));
router.post('/batches/:id/revoke', asyncHandler(revokeBatch));
export default router;
