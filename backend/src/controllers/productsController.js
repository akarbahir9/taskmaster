const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// @desc    Get all products with pagination and filters
// @route   GET /api/products
// @access  Private (all roles)
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      supplier,
      lowStock,
      isActive
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { SKU: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    if (supplier) filter.supplier = supplier;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let query = Product.find(filter)
      .populate('supplier', 'name contactPerson phoneNumber')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNumber);

    // Add low stock filter if requested
    if (lowStock === 'true') {
      // This needs to be done after the query since we're using a virtual
      const allProducts = await Product.find(filter)
        .populate('supplier', 'name contactPerson phoneNumber');
      
      const lowStockProducts = allProducts.filter(product => product.isLowStock);
      const total = lowStockProducts.length;
      const products = lowStockProducts.slice(skip, skip + limitNumber);

      return res.status(200).json({
        success: true,
        data: {
          products,
          pagination: {
            current: pageNumber,
            pages: Math.ceil(total / limitNumber),
            total,
            limit: limitNumber
          }
        }
      });
    }

    const products = await query;
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          current: pageNumber,
          pages: Math.ceil(total / limitNumber),
          total,
          limit: limitNumber
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private (all roles)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name contactPerson phoneNumber email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product'
    });
  }
};

// @desc    Search products (for POS quick lookup)
// @route   GET /api/products/search
// @access  Private (all roles)
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { SKU: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('name SKU price currentStock unitOfMeasure category')
    .limit(parseInt(limit))
    .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching products'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (manager, admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      SKU,
      description,
      category,
      unitOfMeasure,
      price,
      costPrice,
      currentStock,
      reorderPoint,
      reorderQuantity,
      supplier,
      expiryDateTracking
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ SKU: SKU.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with SKU '${SKU}' already exists`
      });
    }

    // Verify supplier exists
    const supplierDoc = await Supplier.findById(supplier);
    if (!supplierDoc) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    const product = await Product.create({
      name,
      SKU: SKU.toUpperCase(),
      description,
      category,
      unitOfMeasure,
      price,
      costPrice,
      currentStock,
      reorderPoint,
      reorderQuantity,
      supplier,
      expiryDateTracking
    });

    await product.populate('supplier', 'name contactPerson phoneNumber');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (manager, admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If SKU is being updated, check for duplicates
    if (req.body.SKU && req.body.SKU.toUpperCase() !== product.SKU) {
      const existingProduct = await Product.findOne({ 
        SKU: req.body.SKU.toUpperCase(),
        _id: { $ne: product._id }
      });
      
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: `Product with SKU '${req.body.SKU}' already exists`
        });
      }
    }

    // If supplier is being updated, verify it exists
    if (req.body.supplier) {
      const supplierDoc = await Supplier.findById(req.body.supplier);
      if (!supplierDoc) {
        return res.status(404).json({
          success: false,
          message: 'Supplier not found'
        });
      }
    }

    // Update SKU to uppercase if provided
    if (req.body.SKU) {
      req.body.SKU = req.body.SKU.toUpperCase();
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('supplier', 'name contactPerson phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Instead of deleting, deactivate the product to preserve sales history
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private (manager, admin)
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('supplier', 'name contactPerson phoneNumber');

    const lowStockProducts = products.filter(product => product.isLowStock);

    res.status(200).json({
      success: true,
      data: {
        products: lowStockProducts,
        count: lowStockProducts.length
      }
    });

  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching low stock products'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Private (all roles)
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find({ 
      category,
      isActive: true 
    })
    .populate('supplier', 'name')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limitNumber);

    const total = await Product.countDocuments({ 
      category,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: {
        products,
        category,
        pagination: {
          current: pageNumber,
          pages: Math.ceil(total / limitNumber),
          total,
          limit: limitNumber
        }
      }
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products by category'
    });
  }
};

// @desc    Get product categories with counts
// @route   GET /api/products/categories/summary
// @access  Private (all roles)
const getCategorySummary = async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ['$currentStock', '$reorderPoint'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: { categories: summary }
    });

  } catch (error) {
    console.error('Get category summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching category summary'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductsByCategory,
  getCategorySummary
};