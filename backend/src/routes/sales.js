const express = require('express');
const { 
  createSale, 
  getSales, 
  getSaleById, 
  processSaleReturn, 
  getDailySummary 
} = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/auth');
const { validate, saleSchemas } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/sales
// @desc    Create new sale
// @access  Private (cashier, manager, admin)
router.post('/', protect, authorize('cashier', 'manager', 'admin'), validate(saleSchemas.create), createSale);

// @route   GET /api/sales
// @desc    Get all sales with pagination and filters
// @access  Private (all roles)
router.get('/', protect, getSales);

// @route   GET /api/sales/daily-summary
// @desc    Get daily sales summary
// @access  Private (all roles)
router.get('/daily-summary', protect, getDailySummary);

// @route   GET /api/sales/:id
// @desc    Get sale by ID
// @access  Private (all roles)
router.get('/:id', protect, getSaleById);

// @route   POST /api/sales/:id/return
// @desc    Process sale return
// @access  Private (manager, admin)
router.post('/:id/return', protect, authorize('manager', 'admin'), processSaleReturn);

module.exports = router;