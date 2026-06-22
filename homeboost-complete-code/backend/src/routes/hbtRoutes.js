import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createHbt, listHbts, listTeamMembers } from '../controllers/hbtController.js';

const router = Router();
router.use(requireAuth, requireRoles('admin', 'hbt_admin'));
router.get('/', asyncHandler(listHbts));
router.post('/', requireRoles('admin'), validate(z.object({ name: z.string().min(2), supportEmail: z.string().email(), supportPhone: z.string().optional() })), asyncHandler(createHbt));
router.get('/:hbtId/team-members', asyncHandler(listTeamMembers));
export default router;
