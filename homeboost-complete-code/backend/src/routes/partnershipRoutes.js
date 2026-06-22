import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPartnership, listPartnerships, updatePartnership } from '../controllers/partnershipController.js';

const router = Router();
router.use(requireAuth, requireRoles('admin', 'hbt_admin'));

router.get('/', asyncHandler(listPartnerships));
router.post('/', validate(z.object({
  employerName: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  hbtId: z.number().optional().nullable(),
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional()
})), asyncHandler(createPartnership));
router.patch('/:id', validate(z.object({
  name: z.string().optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional()
})), asyncHandler(updatePartnership));

export default router;
