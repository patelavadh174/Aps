import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getActiveQuiz, listQuizzes, listSubmissions, submitQuiz } from '../controllers/quizController.js';

const router = Router();
router.get('/', requireAuth, requireRoles('admin', 'hbt_admin'), asyncHandler(listQuizzes));
router.get('/active', requireAuth, requireRoles('employee'), asyncHandler(getActiveQuiz));
router.post('/:quizId/submit', requireAuth, requireRoles('employee'), validate(z.object({
  answers: z.array(z.object({
    questionId: z.number(),
    optionId: z.number().optional().nullable(),
    answerText: z.string().optional().nullable()
  })).min(1)
})), asyncHandler(submitQuiz));
router.get('/submissions', requireAuth, requireRoles('admin', 'hbt_admin', 'hbt_member'), asyncHandler(listSubmissions));
export default router;
