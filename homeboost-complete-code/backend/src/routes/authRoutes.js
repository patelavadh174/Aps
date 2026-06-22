import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';
import { login, me, signup } from '../controllers/authController.js';

const router = Router();

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  partnershipSlug: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post('/signup', authLimiter, validate(signupSchema), asyncHandler(signup));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));

export default router;
