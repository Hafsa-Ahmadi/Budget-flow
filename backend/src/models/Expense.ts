import mongoose, { Document, Schema } from 'mongoose';

export interface ISplitDetail {
  userId: mongoose.Types.ObjectId;
  amount: number;
  paid: boolean;
}

export interface IExpense extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
  paidBy: mongoose.Types.ObjectId;
  splitBetween: ISplitDetail[];
  receiptUrl?: string;
  notes?: string;
  settled: boolean;
  groupId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const splitDetailSchema = new Schema<ISplitDetail>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Split amount cannot be negative']
    },
    paid: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const expenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [3, 'Description must be at least 3 characters'],
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other'],
      default: 'Other'
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Paid by user is required']
    },
    splitBetween: {
      type: [splitDetailSchema],
      required: [true, 'Split details are required'],
      validate: {
        validator: function (splits: ISplitDetail[]) {
          return splits.length > 0;
        },
        message: 'At least one person must be included in the split'
      }
    },
    receiptUrl: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: null
    },
    settled: {
      type: Boolean,
      default: false
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
expenseSchema.index({ paidBy: 1, date: -1 });
expenseSchema.index({ 'splitBetween.userId': 1, date: -1 });
expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ settled: 1 });
expenseSchema.index({ createdAt: -1 });

// Virtual for checking if expense is fully paid
expenseSchema.virtual('isFullyPaid').get(function () {
  return this.splitBetween.every(split => split.paid);
});

// Pre-save hook to validate split amounts
expenseSchema.pre('save', function (next) {
  const totalSplitAmount = this.splitBetween.reduce(
    (sum, split) => sum + split.amount,
    0
  );

  // Allow small rounding differences (0.01)
  if (Math.abs(totalSplitAmount - this.amount) > 0.01) {
    return next(
      new Error('Sum of split amounts must equal total expense amount')
    );
  }

  next();
});

const Expense = mongoose.model<IExpense>('Expense', expenseSchema);

export default Expense;