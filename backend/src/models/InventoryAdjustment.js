const mongoose = require('mongoose');

const inventoryAdjustmentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  productSKU: {
    type: String,
    required: [true, 'Product SKU is required']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  adjustmentType: {
    type: String,
    required: [true, 'Adjustment type is required'],
    enum: [
      'damage',
      'theft', 
      'expired',
      'count_discrepancy',
      'initial_stock',
      'return_to_supplier',
      'promotion_giveaway',
      'sample',
      'other'
    ]
  },
  quantityBefore: {
    type: Number,
    required: [true, 'Quantity before adjustment is required'],
    min: [0, 'Quantity before cannot be negative']
  },
  quantityAdjusted: {
    type: Number,
    required: [true, 'Quantity adjusted is required']
  },
  quantityAfter: {
    type: Number,
    required: [true, 'Quantity after adjustment is required'],
    min: [0, 'Quantity after cannot be negative']
  },
  costImpact: {
    type: Number,
    required: [true, 'Cost impact is required'],
    set: v => Math.round(v * 100) / 100
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Adjustment date is required'],
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  referenceDocument: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
inventoryAdjustmentSchema.index({ productId: 1 });
inventoryAdjustmentSchema.index({ date: 1 });
inventoryAdjustmentSchema.index({ adjustmentType: 1 });
inventoryAdjustmentSchema.index({ userId: 1 });
inventoryAdjustmentSchema.index({ status: 1 });

// Pre-save middleware to calculate quantity after and cost impact
inventoryAdjustmentSchema.pre('save', function(next) {
  this.quantityAfter = this.quantityBefore + this.quantityAdjusted;
  
  // Ensure quantity after is not negative
  if (this.quantityAfter < 0) {
    this.quantityAfter = 0;
    this.quantityAdjusted = -this.quantityBefore;
  }
  
  next();
});

// Virtual to determine if adjustment increases or decreases stock
inventoryAdjustmentSchema.virtual('adjustmentDirection').get(function() {
  return this.quantityAdjusted >= 0 ? 'increase' : 'decrease';
});

// Virtual for adjustment impact description
inventoryAdjustmentSchema.virtual('impactDescription').get(function() {
  const direction = this.quantityAdjusted >= 0 ? 'increased' : 'decreased';
  return `Stock ${direction} by ${Math.abs(this.quantityAdjusted)} units`;
});

// Method to approve adjustment
inventoryAdjustmentSchema.methods.approve = function(approvedBy) {
  this.status = 'approved';
  this.approvedBy = approvedBy;
  this.approvedDate = new Date();
  return this.save();
};

// Method to reject adjustment
inventoryAdjustmentSchema.methods.reject = function(approvedBy, reason) {
  this.status = 'rejected';
  this.approvedBy = approvedBy;
  this.approvedDate = new Date();
  if (reason) {
    this.notes = (this.notes || '') + `\nRejection reason: ${reason}`;
  }
  return this.save();
};

module.exports = mongoose.model('InventoryAdjustment', inventoryAdjustmentSchema);