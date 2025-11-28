import { Response } from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense';
import Budget from '../models/Budget';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { description, amount, category, date, paidBy, splitBetween, notes, receiptUrl } = req.body;

    if (!description || !amount || !category || !paidBy || !splitBetween) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
      return;
    }

    // Calculate equal split amounts
    const splitAmount = amount / splitBetween.length;
    const splitDetails = splitBetween.map((userId: string) => ({
      userId,
      amount: splitAmount,
      paid: userId === paidBy
    }));

    const expense = await Expense.create({
      description,
      amount,
      category,
      date: date || new Date(),
      paidBy,
      splitBetween: splitDetails,
      notes,
      receiptUrl,
      createdBy: req.userId,
      settled: false
    });

    // Update budgets for all split participants
    const currentDate = new Date(date || Date.now());
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    for (const split of splitDetails) {
      await Budget.findOneAndUpdate(
        {
          userId: split.userId,
          category,
          month,
          year
        },
        {
          $inc: { spent: split.amount }
        }
      );
    }

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense: populatedExpense }
    });
  } catch (error: any) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating expense'
    });
  }
};

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, startDate, endDate, settled, page = 1, limit = 20 } = req.query;

    const filter: any = {
      $or: [
        { paidBy: req.userId },
        { 'splitBetween.userId': req.userId }
      ]
    };

    if (category) filter.category = category;
    if (settled !== undefined) filter.settled = settled === 'true';

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const expenses = await Expense.find(filter)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching expenses'
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
      return;
    }

    // Check if user is involved in this expense
    const isInvolved = 
      expense.paidBy._id.toString() === req.userId ||
      expense.splitBetween.some(split => split.userId._id.toString() === req.userId);

    if (!isInvolved) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this expense'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { expense }
    });
  } catch (error: any) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching expense'
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
      return;
    }

    // Only creator can update
    if (expense.createdBy.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
      return;
    }

    const { description, notes, category } = req.body;

    if (description) expense.description = description;
    if (notes !== undefined) expense.notes = notes;
    if (category) expense.category = category;

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense: updatedExpense }
    });
  } catch (error: any) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating expense'
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
      return;
    }

    // Only creator can delete
    if (expense.createdBy.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
      return;
    }

    // Update budgets before deleting
    const expenseDate = new Date(expense.date);
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    for (const split of expense.splitBetween) {
      await Budget.findOneAndUpdate(
        {
          userId: split.userId,
          category: expense.category,
          month,
          year
        },
        {
          $inc: { spent: -split.amount }
        }
      );
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting expense'
    });
  }
};

// @desc    Mark expense as settled
// @route   PUT /api/expenses/:id/settle
// @access  Private
export const settleExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
      return;
    }

    // Only payer can settle
    if (expense.paidBy.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'Only the payer can mark expense as settled'
      });
      return;
    }

    expense.settled = true;
    expense.splitBetween = expense.splitBetween.map(split => ({
      ...split,
      paid: true
    }));

    await expense.save();

    const settledExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.userId', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Expense marked as settled',
      data: { expense: settledExpense }
    });
  } catch (error: any) {
    console.error('Settle expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error settling expense'
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
export const getExpenseStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage: any = {
      $or: [
        { paidBy: new mongoose.Types.ObjectId(req.userId) },
        { 'splitBetween.userId': new mongoose.Types.ObjectId(req.userId) }
      ]
    };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate as string);
      if (endDate) matchStage.date.$lte = new Date(endDate as string);
    }

    const stats = await Expense.aggregate([
      { $match: matchStage },
      { $unwind: '$splitBetween' },
      {
        $match: {
          'splitBetween.userId': new mongoose.Types.ObjectId(req.userId)
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$splitBetween.amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error: any) {
    console.error('Get expense stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching expense statistics'
    });
  }
};