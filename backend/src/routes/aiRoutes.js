import { Router } from 'express';
import protect from '../middleware/protect.js';
import { chat, getInsights } from '../controllers/aiController.js';

const router = Router();

router.use(protect);

router.post('/chat', chat);
router.get('/insights', getInsights);

export default router;
