import { Router } from 'express';
import { getPublicPrompts, getPublicPrompt } from '../controllers/public.controller';

const router = Router();

router.get('/prompts', getPublicPrompts);
router.get('/prompts/:id', getPublicPrompt);

export default router;
