import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createResource, deleteResource, getResource, listResources, updateResource } from '../controllers/resourceController.js';

const router = Router();
const resourceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  category: z.string().optional(),
  summary: z.string().optional(),
  body: z.string().min(1),
  visibility: z.enum(['public', 'employee', 'hbt', 'admin']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  hbtId: z.number().optional().nullable()
});

router.get('/', asyncHandler(listResources));
router.get('/:idOrSlug', asyncHandler(getResource));
router.post('/', requireAuth, requireRoles('admin', 'hbt_admin'), validate(resourceSchema), asyncHandler(createResource));
router.patch('/:id', requireAuth, requireRoles('admin', 'hbt_admin'), validate(resourceSchema.partial()), asyncHandler(updateResource));
router.delete('/:id', requireAuth, requireRoles('admin', 'hbt_admin'), asyncHandler(deleteResource));

export default router;
