const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  SKU: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'SKU cannot exceed 20 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: [
      'Beverages', 'Dairy', 'Meat & Poultry', 'Seafood', 'Fresh Produce',
      'Frozen Foods', 'Bakery', 'Pantry', 'Snacks', 'Health & Beauty',
      'Household', 'Baby Care', 'Pet Care', 'Other'
    ]
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Unit of measure is required'],
    enum: ['piece', 'kg', 'g', 'liter', 'ml', 'dozen', 'pack', 'box', 'bag'],
    default: 'piece'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    set: v => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  reorderPoint: {
    type: Number,
    required: [true, 'Reorder point is required'],
    min: [0, 'Reorder point cannot be negative'],
    default: 10
  },
  reorderQuantity: {
    type: Number,
    required: [true, 'Reorder quantity is required'],
    min: [1, 'Reorder quantity must be at least 1'],
    default: 50
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required']
  },
  expiryDateTracking: {
    type: Boolean,
    default: false
  },
  batchInfo: [{
    batchNumber: String,
    expiryDate: Date,
    quantity: Number,
    receivedDate: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ SKU: 1 });
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ currentStock: 1 });
productSchema.index({ reorderPoint: 1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.costPrice === 0) return 0;
  return ((this.price - this.costPrice) / this.costPrice * 100).toFixed(2);
});

// Virtual to check if stock is low
productSchema.virtual('isLowStock').get(function() {
  return this.currentStock <= this.reorderPoint;
});

// Method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.currentStock = Math.max(0, this.currentStock - quantity);
  } else if (operation === 'add') {
    this.currentStock += quantity;
  }
  this.lastUpdated = new Date();
  return this.save();
};

// Pre-save middleware to update lastUpdated
productSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastUpdated')) {
    this.lastUpdated = new Date();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);