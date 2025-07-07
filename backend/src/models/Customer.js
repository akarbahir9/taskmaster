const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: [0, 'Loyalty points cannot be negative']
  },
  purchaseHistory: [{
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale'
    },
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      min: [0, 'Amount cannot be negative']
    }
  }],
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  lastVisit: {
    type: Date
  },
  customerSince: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for performance
customerSchema.index({ phoneNumber: 1 });
customerSchema.index({ name: 1 });
customerSchema.index({ loyaltyPoints: 1 });

// Virtual for customer tier based on total spent
customerSchema.virtual('customerTier').get(function() {
  if (this.totalSpent >= 10000) return 'Platinum';
  if (this.totalSpent >= 5000) return 'Gold';
  if (this.totalSpent >= 1000) return 'Silver';
  return 'Bronze';
});

// Method to add purchase to history
customerSchema.methods.addPurchase = function(saleId, amount) {
  this.purchaseHistory.push({
    saleId,
    amount,
    date: new Date()
  });
  this.totalSpent += amount;
  this.lastVisit = new Date();
  
  // Add loyalty points (1 point per $10 spent)
  const pointsEarned = Math.floor(amount / 10);
  this.loyaltyPoints += pointsEarned;
  
  return this.save();
};

// Method to redeem loyalty points
customerSchema.methods.redeemPoints = function(points) {
  if (points > this.loyaltyPoints) {
    throw new Error('Insufficient loyalty points');
  }
  this.loyaltyPoints -= points;
  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);