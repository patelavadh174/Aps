import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listFaqs, listPages, listPricing, saveFaq, savePricing, upsertPage } from '../controllers/cmsController.js';

const router = Router();
router.get('/pages', requireAuth, requireRoles('admin'), asyncHandler(listPages));
router.post('/pages', requireAuth, requireRoles('admin'), validate(z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaDescription: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional()
})), asyncHandler(upsertPage));
router.get('/pricing', asyncHandler(listPricing));
router.post('/pricing', requireAuth, requireRoles('admin'), validate(z.object({
  name: z.string().min(1), description: z.string().optional(), priceLabel: z.string().optional(), featureList: z.string().optional(), displayOrder: z.number().optional()
})), asyncHandler(savePricing));
router.get('/faqs', asyncHandler(listFaqs));
router.post('/faqs', requireAuth, requireRoles('admin'), validate(z.object({
  question: z.string().min(2), answer: z.string().min(2), category: z.string().optional(), displayOrder: z.number().optional()
})), asyncHandler(saveFaq));
export default router;
