import { Router } from 'express';
import { body } from 'express-validator';
import protect from '../middleware/protect.js';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from '../controllers/transactionController.js';

const router = Router();

router.use(protect);

router.get('/', getTransactions);
router.get('/summary', getSummary);
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('type').isIn(['income', 'expense']).withMessage("Type must be 'income' or 'expense'"),
  ],
  addTransaction
);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
