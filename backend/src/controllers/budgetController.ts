import { Response } from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

interface Balance {
  userId: string;
  userName: string;
  balance: number;
}

interface Settlement {
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  amount: number;
}

// @desc    Calculate settlements between users
// @route   GET /api/settlements
// @access  Private
export const getSettlements = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.query;

    let involvedUserIds: string[];

    if (userIds && typeof userIds === 'string') {
      // Get settlements for specific users
      involvedUserIds = userIds.split(',');
      
      // Ensure current user is included
      if (!involvedUserIds.includes(req.userId!)) {
        involvedUserIds.push(req.userId!);
      }
    } else {
      // Get all users involved in expenses with current user
      const expenses = await Expense.find({
        $or: [
          { paidBy: req.userId },
          { 'splitBetween.userId': req.userId }
        ],
        settled: false
      });

      const userIdSet = new Set<string>();
      userIdSet.add(req.userId!);

      expenses.forEach(expense => {
        userIdSet.add(expense.paidBy.toString());
        expense.splitBetween.forEach(split => {
          userIdSet.add(split.userId.toString());
        });
      });

      involvedUserIds = Array.from(userIdSet);
    }

    // Get all unsettled expenses involving these users
    const expenses = await Expense.find({
      settled: false,
      $or: [
        { paidBy: { $in: involvedUserIds } },
        { 'splitBetween.userId': { $in: involvedUserIds } }
      ]
    }).populate('paidBy', 'name email')
      .populate('splitBetween.userId', 'name email');

    // Calculate balances
    const balanceMap = new Map<string, Balance>();

    // Initialize balances
    for (const userId of involvedUserIds) {
      const user = await User.findById(userId).select('name');
      if (user) {
        balanceMap.set(userId, {
          userId,
          userName: user.name,
          balance: 0
        });
      }
    }

    // Calculate net balances
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();

      // Add full amount to payer's balance
      if (balanceMap.has(paidById)) {
        const payer = balanceMap.get(paidById)!;
        payer.balance += expense.amount;
      }

      // Subtract split amounts from each participant
      expense.splitBetween.forEach(split => {
        const userId = split.userId._id.toString();
        if (balanceMap.has(userId)) {
          const participant = balanceMap.get(userId)!;
          participant.balance -= split.amount;
        }
      });
    });

    // Optimize settlements using greedy algorithm
    const settlements = optimizeSettlements(Array.from(balanceMap.values()));

    res.status(200).json({
      success: true,
      data: {
        settlements,
        balances: Array.from(balanceMap.values()).map(b => ({
          userId: b.userId,
          userName: b.userName,
          balance: Number(b.balance.toFixed(2)),
          owes: b.balance < 0,
          isOwed: b.balance > 0
        }))
      }
    });
  } catch (error: any) {
    console.error('Get settlements error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating settlements'
    });
  }
};

// @desc    Get settlements for specific group
// @route   GET /api/settlements/group/:groupId
// @access  Private
export const getGroupSettlements = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params;

    // Get all unsettled expenses for the group
    const expenses = await Expense.find({
      groupId,
      settled: false
    }).populate('paidBy', 'name email')
      .populate('splitBetween.userId', 'name email');

    if (expenses.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          settlements: [],
          balances: []
        }
      });
      return;
    }

    // Get unique users from expenses
    const userIdSet = new Set<string>();
    expenses.forEach(expense => {
      userIdSet.add(expense.paidBy._id.toString());
      expense.splitBetween.forEach(split => {
        userIdSet.add(split.userId._id.toString());
      });
    });

    // Calculate balances
    const balanceMap = new Map<string, Balance>();

    for (const userId of Array.from(userIdSet)) {
      const user = await User.findById(userId).select('name');
      if (user) {
        balanceMap.set(userId, {
          userId,
          userName: user.name,
          balance: 0
        });
      }
    }

    // Calculate net balances
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      if (balanceMap.has(paidById)) {
        const payer = balanceMap.get(paidById)!;
        payer.balance += expense.amount;
      }

      expense.splitBetween.forEach(split => {
        const userId = split.userId._id.toString();
        if (balanceMap.has(userId)) {
          const participant = balanceMap.get(userId)!;
          participant.balance -= split.amount;
        }
      });
    });

    const settlements = optimizeSettlements(Array.from(balanceMap.values()));

    res.status(200).json({
      success: true,
      data: {
        settlements,
        balances: Array.from(balanceMap.values()).map(b => ({
          userId: b.userId,
          userName: b.userName,
          balance: Number(b.balance.toFixed(2))
        }))
      }
    });
  } catch (error: any) {
    console.error('Get group settlements error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating group settlements'
    });
  }
};

// Helper function to optimize settlements
function optimizeSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.balance > 0.01)
    .sort((a, b) => b.balance - a.balance);

  const debtors = balances
    .filter(b => b.balance < -0.01)
    .sort((a, b) => a.balance - b.balance);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = Math.min(creditor.balance, -debtor.balance);

    if (settleAmount > 0.01) {
      settlements.push({
        from: {
          id: debtor.userId,
          name: debtor.userName
        },
        to: {
          id: creditor.userId,
          name: creditor.userName
        },
        amount: Number(settleAmount.toFixed(2))
      });

      creditor.balance -= settleAmount;
      debtor.balance += settleAmount;
    }

    if (creditor.balance < 0.01) i++;
    if (debtor.balance > -0.01) j++;
  }

  return settlements;
}

// @desc    Get settlement summary for user
// @route   GET /api/settlements/summary
// @access  Private
export const getSettlementSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.userId },
        { 'splitBetween.userId': req.userId }
      ],
      settled: false
    });

    let totalOwed = 0;
    let totalOwing = 0;

    expenses.forEach(expense => {
      const userSplit = expense.splitBetween.find(
        split => split.userId.toString() === req.userId
      );

      if (expense.paidBy.toString() === req.userId) {
        // User paid, calculate how much others owe
        const othersShare = expense.splitBetween
          .filter(split => split.userId.toString() !== req.userId)
          .reduce((sum, split) => sum + split.amount, 0);
        totalOwed += othersShare;
      } else if (userSplit) {
        // User owes their share
        totalOwing += userSplit.amount;
      }
    });

    const netBalance = totalOwed - totalOwing;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalOwed: Number(totalOwed.toFixed(2)),
          totalOwing: Number(totalOwing.toFixed(2)),
          netBalance: Number(netBalance.toFixed(2)),
          status: netBalance > 0 ? 'owed' : netBalance < 0 ? 'owing' : 'settled'
        }
      }
    });
  } catch (error: any) {
    console.error('Get settlement summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching settlement summary'
    });
  }
};