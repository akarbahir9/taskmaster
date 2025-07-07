const express = require('express');
const { 
  getProducts, 
  getProductById, 
  searchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getLowStockProducts, 
  getProductsByCategory, 
  getCategorySummary 
} = require('../controllers/productsController');
const { protect, authorize } = require('../middleware/auth');
const { validate, productSchemas } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/products/search
// @desc    Search products (for POS quick lookup)
// @access  Private (all roles)
router.get('/search', protect, searchProducts);

// @route   GET /api/products/low-stock
// @desc    Get low stock products
// @access  Private (manager, admin)
router.get('/low-stock', protect, authorize('manager', 'admin'), getLowStockProducts);

// @route   GET /api/products/categories/summary
// @desc    Get product categories with counts
// @access  Private (all roles)
router.get('/categories/summary', protect, getCategorySummary);

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Private (all roles)
router.get('/category/:category', protect, getProductsByCategory);

// @route   GET /api/products
// @desc    Get all products with pagination and filters
// @access  Private (all roles)
router.get('/', protect, getProducts);

// @route   POST /api/products
// @desc    Create new product
// @access  Private (manager, admin)
router.post('/', protect, authorize('manager', 'admin'), validate(productSchemas.create), createProduct);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Private (all roles)
router.get('/:id', protect, getProductById);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (manager, admin)
router.put('/:id', protect, authorize('manager', 'admin'), validate(productSchemas.update), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (deactivate)
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;