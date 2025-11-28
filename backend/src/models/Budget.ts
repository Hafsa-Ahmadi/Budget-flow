import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  limit: number;
  spent: number;
  month: number;
  year: number;
  color: string;
  alertThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other']
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Budget limit cannot be negative']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative']
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12']
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2020, 'Year must be 2020 or later']
    },
    color: {
      type: String,
      default: '#3b82f6',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    },
    alertThreshold: {
      type: Number,
      default: 80,
      min: [0, 'Alert threshold must be between 0 and 100'],
      max: [100, 'Alert threshold must be between 0 and 100']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for budget utilization percentage
budgetSchema.virtual('utilizationPercentage').get(function () {
  return (this.spent / this.limit) * 100;
});

// Virtual for remaining budget
budgetSchema.virtual('remaining').get(function () {
  return Math.max(0, this.limit - this.spent);
});

// Virtual for checking if budget exceeded
budgetSchema.virtual('isExceeded').get(function () {
  return this.spent > this.limit;
});

// Virtual for checking if alert threshold reached
budgetSchema.virtual('alertTriggered').get(function () {
  return (this.spent / this.limit) * 100 >= this.alertThreshold;
});

// Compound index for unique budget per user, category, month, and year
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

// Index for querying budgets by user and time period
budgetSchema.index({ userId: 1, year: -1, month: -1 });

const Budget = mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget;