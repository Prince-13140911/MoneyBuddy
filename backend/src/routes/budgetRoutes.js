import { Router } from 'express';
import protect from '../middleware/protect.js';
import { getBudget, upsertBudget } from '../controllers/budgetController.js';

const router = Router();

router.use(protect);

router.get('/', getBudget);
router.post('/', upsertBudget);

export default router;
