import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUser, deleteUser, listUsers, updateUser } from '../controllers/userController.js';

const router = Router();
router.use(requireAuth, requireRoles('admin', 'hbt_admin'));

const roleEnum = z.enum(['admin', 'hbt_admin', 'hbt_member', 'employee']);
const statusEnum = z.enum(['active', 'disabled', 'invited']);

router.get('/', asyncHandler(listUsers));
router.post('/', requireRoles('admin'), validate(z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: roleEnum,
  partnershipId: z.number().optional().nullable(),
  hbtId: z.number().optional().nullable()
})), asyncHandler(createUser));
router.patch('/:id', validate(z.object({
  role: roleEnum.optional(),
  status: statusEnum.optional(),
  partnershipId: z.number().optional().nullable(),
  hbtId: z.number().optional().nullable()
})), asyncHandler(updateUser));
router.delete('/:id', requireRoles('admin'), asyncHandler(deleteUser));

export default router;
