import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  settleExpense,
  getExpenseStats
} from '../controllers/expenseController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Stats route (must be before :id route)
router.get('/stats', getExpenseStats);

// CRUD routes
router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(deleteExpense);

// Settlement route
router.put('/:id/settle', settleExpense);

export default router;