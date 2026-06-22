import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createEvent, listEvents, updateEvent } from '../controllers/eventController.js';

const router = Router();
router.get('/', requireAuth, asyncHandler(listEvents));
router.post('/', requireAuth, requireRoles('admin', 'hbt_admin'), validate(z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  eventType: z.string().optional(),
  startsAt: z.string(),
  endsAt: z.string().optional().nullable(),
  location: z.string().optional(),
  partnershipId: z.number().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional()
})), asyncHandler(createEvent));
router.patch('/:id', requireAuth, requireRoles('admin', 'hbt_admin'), validate(z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional().nullable(),
  location: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional()
})), asyncHandler(updateEvent));
export default router;
