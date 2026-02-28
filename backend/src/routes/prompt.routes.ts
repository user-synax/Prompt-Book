import { Router } from 'express';
import {
  getPrompts, getPrompt, createPrompt, updatePrompt,
  deletePrompt, duplicatePrompt, toggleFavorite,
  getVersionHistory, getSpecificVersion,
} from '../controllers/prompt.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { createPromptSchema, updatePromptSchema, promptQuerySchema } from '../validators/prompt.validator';

const router = Router();

// All routes require authentication
router.use(auth as any);

router.get('/', validate({ query: promptQuerySchema }), getPrompts);
router.get('/:id', getPrompt);
router.post('/', validate({ body: createPromptSchema }), createPrompt);
router.put('/:id', validate({ body: updatePromptSchema }), updatePrompt);
router.delete('/:id', deletePrompt);
router.post('/:id/duplicate', duplicatePrompt);
router.patch('/:id/favorite', toggleFavorite);
router.get('/:id/versions', getVersionHistory);
router.get('/:id/versions/:version', getSpecificVersion);

export default router;
