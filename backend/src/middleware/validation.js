const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

// User validation schemas
const userSchemas = {
  create: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    passwordHash: Joi.string().min(6).required(),
    role: Joi.string().valid('cashier', 'manager', 'admin').default('cashier'),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional()
  }),
  
  update: Joi.object({
    username: Joi.string().min(3).max(30).optional(),
    role: Joi.string().valid('cashier', 'manager', 'admin').optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
    isActive: Joi.boolean().optional()
  }),
  
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().max(100).required(),
    SKU: Joi.string().max(20).required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid(
      'Beverages', 'Dairy', 'Meat & Poultry', 'Seafood', 'Fresh Produce',
      'Frozen Foods', 'Bakery', 'Pantry', 'Snacks', 'Health & Beauty',
      'Household', 'Baby Care', 'Pet Care', 'Other'
    ).required(),
    unitOfMeasure: Joi.string().valid(
      'piece', 'kg', 'g', 'liter', 'ml', 'dozen', 'pack', 'box', 'bag'
    ).default('piece'),
    price: Joi.number().min(0).required(),
    costPrice: Joi.number().min(0).required(),
    currentStock: Joi.number().min(0).default(0),
    reorderPoint: Joi.number().min(0).default(10),
    reorderQuantity: Joi.number().min(1).default(50),
    supplier: Joi.string().required(), // ObjectId as string
    expiryDateTracking: Joi.boolean().default(false)
  }),
  
  update: Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid(
      'Beverages', 'Dairy', 'Meat & Poultry', 'Seafood', 'Fresh Produce',
      'Frozen Foods', 'Bakery', 'Pantry', 'Snacks', 'Health & Beauty',
      'Household', 'Baby Care', 'Pet Care', 'Other'
    ).optional(),
    unitOfMeasure: Joi.string().valid(
      'piece', 'kg', 'g', 'liter', 'ml', 'dozen', 'pack', 'box', 'bag'
    ).optional(),
    price: Joi.number().min(0).optional(),
    costPrice: Joi.number().min(0).optional(),
    reorderPoint: Joi.number().min(0).optional(),
    reorderQuantity: Joi.number().min(1).optional(),
    supplier: Joi.string().optional(),
    expiryDateTracking: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
  })
};

// Sale validation schemas
const saleSchemas = {
  create: Joi.object({
    itemsSold: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(0.01).required(),
        discountApplied: Joi.number().min(0).default(0)
      })
    ).min(1).required(),
    cashReceived: Joi.number().min(0).required(),
    customerId: Joi.string().optional(),
    notes: Joi.string().max(500).optional()
  })
};

// Supplier validation schemas
const supplierSchemas = {
  create: Joi.object({
    name: Joi.string().max(100).required(),
    contactPerson: Joi.string().max(100).required(),
    phoneNumber: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/).required(),
    email: Joi.string().email().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      country: Joi.string().default('USA')
    }).optional(),
    paymentTerms: Joi.string().valid(
      'Cash on Delivery', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Prepaid'
    ).default('Net 30'),
    notes: Joi.string().max(500).optional()
  }),
  
  update: Joi.object({
    name: Joi.string().max(100).optional(),
    contactPerson: Joi.string().max(100).optional(),
    phoneNumber: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/).optional(),
    email: Joi.string().email().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      country: Joi.string().optional()
    }).optional(),
    paymentTerms: Joi.string().valid(
      'Cash on Delivery', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Prepaid'
    ).optional(),
    isActive: Joi.boolean().optional(),
    notes: Joi.string().max(500).optional()
  })
};

// Customer validation schemas
const customerSchemas = {
  create: Joi.object({
    name: Joi.string().max(100).required(),
    phoneNumber: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/).required(),
    email: Joi.string().email().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional()
    }).optional(),
    notes: Joi.string().max(500).optional()
  }),
  
  update: Joi.object({
    name: Joi.string().max(100).optional(),
    phoneNumber: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/).optional(),
    email: Joi.string().email().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional()
    }).optional(),
    isActive: Joi.boolean().optional(),
    notes: Joi.string().max(500).optional()
  })
};

// Inventory adjustment validation schemas
const inventoryAdjustmentSchemas = {
  create: Joi.object({
    productId: Joi.string().required(),
    adjustmentType: Joi.string().valid(
      'damage', 'theft', 'expired', 'count_discrepancy', 'initial_stock',
      'return_to_supplier', 'promotion_giveaway', 'sample', 'other'
    ).required(),
    quantityAdjusted: Joi.number().required(),
    reason: Joi.string().max(500).required(),
    batchNumber: Joi.string().optional(),
    expiryDate: Joi.date().optional(),
    referenceDocument: Joi.string().optional(),
    notes: Joi.string().max(1000).optional()
  })
};

module.exports = {
  validate,
  userSchemas,
  productSchemas,
  saleSchemas,
  supplierSchemas,
  customerSchemas,
  inventoryAdjustmentSchemas
};