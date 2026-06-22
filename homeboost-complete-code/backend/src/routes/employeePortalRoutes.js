import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { dashboard } from '../controllers/employeePortalController.js';

const router = Router();
router.use(requireAuth, requireRoles('employee'));
router.get('/dashboard', asyncHandler(dashboard));
export default router;
