import { Router } from 'express';
import { body } from 'express-validator';
import protect from '../middleware/protect.js';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';

const router = Router();

router.use(protect);

router.get('/', getGoals);
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Goal name is required'),
    body('targetAmount').isFloat({ min: 1 }).withMessage('Target amount must be greater than 0'),
  ],
  createGoal
);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
