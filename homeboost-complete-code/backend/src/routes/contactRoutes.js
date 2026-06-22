import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { publicWriteLimiter } from '../middleware/rateLimiters.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createContact, listContactMessages, updateContactMessage } from '../controllers/contactController.js';

const router = Router();
router.post('/', publicWriteLimiter, validate(z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(5).max(3000)
})), asyncHandler(createContact));
router.get('/', requireAuth, requireRoles('admin'), asyncHandler(listContactMessages));
router.patch('/:id', requireAuth, requireRoles('admin'), validate(z.object({ status: z.enum(['new', 'read', 'closed']) })), asyncHandler(updateContactMessage));
export default router;
