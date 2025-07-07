const mongoose = require('mongoose');

const purchaseOrderItemSchema = new mongoose.Schema({
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
  quantityOrdered: {
    type: Number,
    required: [true, 'Quantity ordered is required'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  quantityReceived: {
    type: Number,
    default: 0,
    min: [0, 'Quantity received cannot be negative']
  },
  costPriceAtOrder: {
    type: Number,
    required: [true, 'Cost price at order is required'],
    min: [0, 'Cost price cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  lineTotal: {
    type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100
  }
}, { _id: true });

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: [true, 'PO Number is required'],
    unique: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier ID is required']
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required']
  },
  orderDate: {
    type: Date,
    required: [true, 'Order date is required'],
    default: Date.now
  },
  expectedDeliveryDate: {
    type: Date,
    required: [true, 'Expected delivery date is required']
  },
  actualDeliveryDate: {
    type: Date
  },
  items: [purchaseOrderItemSchema],
  subtotalAmount: {
    type: Number,
    required: [true, 'Subtotal amount is required'],
    min: [0, 'Subtotal cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
    set: v => Math.round(v * 100) / 100
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'sent', 'partially_received', 'received', 'cancelled'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
purchaseOrderSchema.index({ poNumber: 1 });
purchaseOrderSchema.index({ supplierId: 1 });
purchaseOrderSchema.index({ orderDate: 1 });
purchaseOrderSchema.index({ status: 1 });

// Pre-save middleware to generate PO number and calculate totals
purchaseOrderSchema.pre('save', function(next) {
  if (this.isNew && !this.poNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    this.poNumber = `PO-${dateStr}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  
  // Calculate line totals for each item
  this.items.forEach(item => {
    item.lineTotal = item.quantityOrdered * item.costPriceAtOrder;
  });
  
  // Calculate totals
  this.subtotalAmount = this.items.reduce((sum, item) => sum + item.lineTotal, 0);
  this.totalAmount = this.subtotalAmount + this.taxAmount;
  
  next();
});

// Virtual to check if order is overdue
purchaseOrderSchema.virtual('isOverdue').get(function() {
  if (this.status === 'received' || this.status === 'cancelled') return false;
  return new Date() > this.expectedDeliveryDate;
});

// Virtual for completion percentage
purchaseOrderSchema.virtual('completionPercentage').get(function() {
  if (this.items.length === 0) return 0;
  
  const totalOrdered = this.items.reduce((sum, item) => sum + item.quantityOrdered, 0);
  const totalReceived = this.items.reduce((sum, item) => sum + item.quantityReceived, 0);
  
  return Math.round((totalReceived / totalOrdered) * 100);
});

// Method to receive items
purchaseOrderSchema.methods.receiveItems = function(receivedItems, receivedBy) {
  receivedItems.forEach(receivedItem => {
    const orderItem = this.items.id(receivedItem.itemId);
    if (orderItem) {
      orderItem.quantityReceived = Math.min(
        orderItem.quantityOrdered,
        orderItem.quantityReceived + receivedItem.quantityReceived
      );
    }
  });
  
  // Update status based on received quantities
  const allItemsReceived = this.items.every(item => 
    item.quantityReceived >= item.quantityOrdered
  );
  const someItemsReceived = this.items.some(item => 
    item.quantityReceived > 0
  );
  
  if (allItemsReceived) {
    this.status = 'received';
    this.actualDeliveryDate = new Date();
  } else if (someItemsReceived) {
    this.status = 'partially_received';
  }
  
  this.receivedBy = receivedBy;
  return this.save();
};

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);