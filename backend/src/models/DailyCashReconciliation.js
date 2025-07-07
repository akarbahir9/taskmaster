const mongoose = require('mongoose');

const cashDenominationSchema = new mongoose.Schema({
  denomination: {
    type: Number,
    required: [true, 'Denomination is required'],
    enum: [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 50, 100]
  },
  count: {
    type: Number,
    required: [true, 'Count is required'],
    min: [0, 'Count cannot be negative'],
    default: 0
  },
  value: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  }
}, { _id: false });

const dailyCashReconciliationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Reconciliation date is required'],
    unique: true,
    default: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  openingCash: {
    type: Number,
    required: [true, 'Opening cash is required'],
    min: [0, 'Opening cash cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  totalCashSales: {
    type: Number,
    required: [true, 'Total cash sales is required'],
    min: [0, 'Total cash sales cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  totalCashReturns: {
    type: Number,
    default: 0,
    min: [0, 'Total cash returns cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  totalExpectedCash: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  },
  physicalCashCount: {
    denominations: [cashDenominationSchema],
    totalPhysicalCash: {
      type: Number,
      required: [true, 'Total physical cash is required'],
      min: [0, 'Total physical cash cannot be negative'],
      set: v => Math.round(v * 100) / 100
    }
  },
  cashDiscrepancy: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  },
  cashWithdrawals: [{
    amount: {
      type: Number,
      required: [true, 'Withdrawal amount is required'],
      min: [0.01, 'Withdrawal amount must be greater than 0'],
      set: v => Math.round(v * 100) / 100
    },
    reason: {
      type: String,
      required: [true, 'Withdrawal reason is required'],
      enum: ['bank_deposit', 'petty_cash', 'expense_payment', 'safe_deposit', 'other']
    },
    description: {
      type: String,
      required: [true, 'Withdrawal description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    authorizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Authorized by is required']
    },
    withdrawnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Withdrawn by is required']
    },
    time: {
      type: Date,
      default: Date.now
    }
  }],
  totalWithdrawals: {
    type: Number,
    default: 0,
    min: [0, 'Total withdrawals cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  adjustedExpectedCash: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  },
  finalDiscrepancy: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['in_progress', 'reconciled', 'discrepancy_pending', 'approved_with_variance'],
    default: 'in_progress'
  },
  reconciledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reconciledAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  varianceReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Variance reason cannot exceed 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
dailyCashReconciliationSchema.index({ date: 1 });
dailyCashReconciliationSchema.index({ status: 1 });
dailyCashReconciliationSchema.index({ reconciledBy: 1 });

// Pre-save middleware to calculate totals and discrepancies
dailyCashReconciliationSchema.pre('save', function(next) {
  // Calculate total expected cash
  this.totalExpectedCash = this.openingCash + this.totalCashSales - this.totalCashReturns;
  
  // Calculate total withdrawals
  this.totalWithdrawals = this.cashWithdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);
  
  // Calculate adjusted expected cash after withdrawals
  this.adjustedExpectedCash = this.totalExpectedCash - this.totalWithdrawals;
  
  // Calculate physical cash total from denominations
  if (this.physicalCashCount.denominations && this.physicalCashCount.denominations.length > 0) {
    this.physicalCashCount.denominations.forEach(denom => {
      denom.value = denom.denomination * denom.count;
    });
    
    this.physicalCashCount.totalPhysicalCash = this.physicalCashCount.denominations.reduce(
      (sum, denom) => sum + denom.value, 0
    );
  }
  
  // Calculate cash discrepancy
  this.cashDiscrepancy = this.physicalCashCount.totalPhysicalCash - this.totalExpectedCash;
  
  // Calculate final discrepancy after adjustments
  this.finalDiscrepancy = this.physicalCashCount.totalPhysicalCash - this.adjustedExpectedCash;
  
  next();
});

// Virtual to check if reconciliation is balanced
dailyCashReconciliationSchema.virtual('isBalanced').get(function() {
  return Math.abs(this.finalDiscrepancy) < 0.01; // Allow for rounding differences
});

// Virtual for discrepancy type
dailyCashReconciliationSchema.virtual('discrepancyType').get(function() {
  if (this.isBalanced) return 'none';
  return this.finalDiscrepancy > 0 ? 'overage' : 'shortage';
});

// Method to reconcile
dailyCashReconciliationSchema.methods.reconcile = function(reconciledBy, varianceReason = null) {
  this.reconciledBy = reconciledBy;
  this.reconciledAt = new Date();
  
  if (this.isBalanced) {
    this.status = 'reconciled';
  } else {
    this.status = 'discrepancy_pending';
    if (varianceReason) {
      this.varianceReason = varianceReason;
    }
  }
  
  return this.save();
};

// Method to approve with variance
dailyCashReconciliationSchema.methods.approveWithVariance = function(approvedBy, reason) {
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  this.status = 'approved_with_variance';
  this.varianceReason = reason;
  return this.save();
};

// Method to add cash withdrawal
dailyCashReconciliationSchema.methods.addWithdrawal = function(withdrawal) {
  this.cashWithdrawals.push(withdrawal);
  return this.save();
};

module.exports = mongoose.model('DailyCashReconciliation', dailyCashReconciliationSchema);