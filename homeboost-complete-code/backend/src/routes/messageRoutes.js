import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createMyThreadMessage, getMyThread, getThread, listThreads, replyToThread } from '../controllers/messageController.js';

const router = Router();
const messageSchema = z.object({ body: z.string().min(1).max(5000), status: z.enum(['open', 'pending', 'closed']).optional() });

router.get('/my-thread', requireAuth, requireRoles('employee'), asyncHandler(getMyThread));
router.post('/my-thread', requireAuth, requireRoles('employee'), validate(messageSchema), asyncHandler(createMyThreadMessage));
router.get('/threads', requireAuth, requireRoles('admin', 'hbt_admin', 'hbt_member'), asyncHandler(listThreads));
router.get('/threads/:threadId', requireAuth, asyncHandler(getThread));
router.post('/threads/:threadId/replies', requireAuth, requireRoles('admin', 'hbt_admin', 'hbt_member'), validate(messageSchema), asyncHandler(replyToThread));
export default router;
