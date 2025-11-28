import express from 'express';
import {
  getSettlements,
  getGroupSettlements,
  getSettlementSummary
} from '../controllers/settlementController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getSettlements);
router.get('/summary', getSettlementSummary);
router.get('/group/:groupId', getGroupSettlements);

export default router;