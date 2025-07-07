const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  priceAtSale: {
    type: Number,
    required: [true, 'Price at sale is required'],
    min: [0, 'Price cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  costPriceAtSale: {
    type: Number,
    required: [true, 'Cost price at sale is required'],
    min: [0, 'Cost price cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  subtotal: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  }
}, { _id: true });

const saleSchema = new mongoose.Schema({
  saleId: {
    type: String,
    required: [true, 'Sale ID is required'],
    unique: true
  },
  date: {
    type: Date,
    required: [true, 'Sale date is required'],
    default: Date.now
  },
  itemsSold: [saleItemSchema],
  subtotalAmount: {
    type: Number,
    required: [true, 'Subtotal amount is required'],
    min: [0, 'Subtotal cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  totalDiscount: {
    type: Number,
    default: 0,
    min: [0, 'Total discount cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  cashReceived: {
    type: Number,
    required: [true, 'Cash received is required'],
    min: [0, 'Cash received cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  changeGiven: {
    type: Number,
    required: [true, 'Change given is required'],
    min: [0, 'Change given cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cashier ID is required']
  },
  cashierName: {
    type: String,
    required: [true, 'Cashier name is required']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null
  },
  customerName: {
    type: String,
    default: 'Walk-in Customer'
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['completed', 'returned', 'partially_returned'],
    default: 'completed'
  },
  returnedItems: [{
    saleItemId: {
      type: mongoose.Schema.Types.ObjectId
    },
    quantityReturned: {
      type: Number,
      min: [0.01, 'Returned quantity must be greater than 0']
    },
    returnReason: {
      type: String,
      enum: ['damaged', 'expired', 'customer_request', 'wrong_item', 'other']
    },
    returnDate: {
      type: Date,
      default: Date.now
    },
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative'],
      set: v => Math.round(v * 100) / 100
    }
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
saleSchema.index({ saleId: 1 });
saleSchema.index({ date: 1 });
saleSchema.index({ cashierId: 1 });
saleSchema.index({ customerId: 1 });
saleSchema.index({ status: 1 });
saleSchema.index({ 'itemsSold.productId': 1 });

// Pre-save middleware to generate saleId and calculate totals
saleSchema.pre('save', function(next) {
  if (this.isNew && !this.saleId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');
    this.saleId = `SAL-${dateStr}-${timeStr}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  // Calculate subtotals for each item
  this.itemsSold.forEach(item => {
    item.subtotal = (item.quantity * item.priceAtSale) - item.discountApplied;
  });
  
  // Calculate totals
  this.subtotalAmount = this.itemsSold.reduce((sum, item) => sum + (item.quantity * item.priceAtSale), 0);
  this.totalDiscount = this.itemsSold.reduce((sum, item) => sum + item.discountApplied, 0);
  this.totalAmount = this.subtotalAmount - this.totalDiscount;
  this.changeGiven = Math.max(0, this.cashReceived - this.totalAmount);
  
  next();
});

// Virtual for profit calculation
saleSchema.virtual('totalProfit').get(function() {
  return this.itemsSold.reduce((profit, item) => {
    const itemProfit = (item.priceAtSale - item.costPriceAtSale) * item.quantity - item.discountApplied;
    return profit + itemProfit;
  }, 0);
});

// Method to process return
saleSchema.methods.processReturn = function(itemReturns) {
  itemReturns.forEach(returnItem => {
    const saleItem = this.itemsSold.id(returnItem.saleItemId);
    if (saleItem) {
      this.returnedItems.push({
        saleItemId: returnItem.saleItemId,
        quantityReturned: returnItem.quantityReturned,
        returnReason: returnItem.returnReason,
        refundAmount: returnItem.refundAmount
      });
    }
  });
  
  // Update status
  const hasPartialReturns = this.returnedItems.length > 0 && 
    this.itemsSold.some(item => {
      const totalReturned = this.returnedItems
        .filter(ret => ret.saleItemId.equals(item._id))
        .reduce((sum, ret) => sum + ret.quantityReturned, 0);
      return totalReturned < item.quantity;
    });
  
  if (hasPartialReturns) {
    this.status = 'partially_returned';
  } else if (this.returnedItems.length > 0) {
    this.status = 'returned';
  }
  
  return this.save();
};

module.exports = mongoose.model('Sale', saleSchema);