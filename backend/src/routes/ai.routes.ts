import { Router } from 'express';
import { generate, getHistory } from '../controllers/ai.controller';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/rateLimiter';
import { generateSchema } from '../validators/ai.validator';

const router = Router();

router.use(auth as any);

router.post('/generate', aiRateLimiter, validate({ body: generateSchema }), generate);
router.get('/history', getHistory);

export default router;
