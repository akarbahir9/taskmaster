const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private (cashier, manager, admin)
const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemsSold, cashReceived, customerId, notes } = req.body;
    const cashierId = req.user.id;
    const cashierName = req.user.fullName;

    // Validate and prepare sale items
    const processedItems = [];
    let subtotalAmount = 0;
    let totalDiscount = 0;

    for (const item of itemsSold) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (!product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not active`
        });
      }

      if (product.currentStock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}`
        });
      }

      // Calculate item totals
      const itemSubtotal = item.quantity * product.price;
      const itemDiscount = item.discountApplied || 0;
      
      subtotalAmount += itemSubtotal;
      totalDiscount += itemDiscount;

      processedItems.push({
        productId: product._id,
        productSKU: product.SKU,
        productName: product.name,
        quantity: item.quantity,
        priceAtSale: product.price,
        costPriceAtSale: product.costPrice,
        discountApplied: itemDiscount,
        subtotal: itemSubtotal - itemDiscount
      });

      // Update product stock
      product.currentStock -= item.quantity;
      await product.save({ session });
    }

    const totalAmount = subtotalAmount - totalDiscount;
    const changeGiven = Math.max(0, cashReceived - totalAmount);

    if (cashReceived < totalAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Insufficient cash received. Total: $${totalAmount.toFixed(2)}, Received: $${cashReceived.toFixed(2)}`
      });
    }

    // Handle customer if provided
    let customerName = 'Walk-in Customer';
    if (customerId) {
      const customer = await Customer.findById(customerId).session(session);
      if (customer) {
        customerName = customer.name;
        // Add purchase to customer history
        await customer.addPurchase(null, totalAmount); // Will update with sale ID after creation
      }
    }

    // Create sale
    const sale = new Sale({
      itemsSold: processedItems,
      subtotalAmount,
      totalDiscount,
      totalAmount,
      cashReceived,
      changeGiven,
      cashierId,
      cashierName,
      customerId: customerId || null,
      customerName,
      notes
    });

    await sale.save({ session });

    // Update customer purchase history with sale ID
    if (customerId) {
      const customer = await Customer.findById(customerId).session(session);
      if (customer) {
        const lastPurchase = customer.purchaseHistory[customer.purchaseHistory.length - 1];
        lastPurchase.saleId = sale._id;
        await customer.save({ session });
      }
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: {
        sale: {
          id: sale._id,
          saleId: sale.saleId,
          date: sale.date,
          itemsSold: sale.itemsSold,
          subtotalAmount: sale.subtotalAmount,
          totalDiscount: sale.totalDiscount,
          totalAmount: sale.totalAmount,
          cashReceived: sale.cashReceived,
          changeGiven: sale.changeGiven,
          cashierName: sale.cashierName,
          customerName: sale.customerName,
          status: sale.status,
          totalProfit: sale.totalProfit
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Create sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating sale'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get all sales with pagination and filters
// @route   GET /api/sales
// @access  Private (cashier, manager, admin)
const getSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      cashierId,
      customerId,
      status,
      minAmount,
      maxAmount
    } = req.query;

    // Build filter object
    const filter = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (cashierId) filter.cashierId = cashierId;
    if (customerId) filter.customerId = customerId;
    if (status) filter.status = status;

    if (minAmount || maxAmount) {
      filter.totalAmount = {};
      if (minAmount) filter.totalAmount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.totalAmount.$lte = parseFloat(maxAmount);
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const sales = await Sale.find(filter)
      .populate('cashierId', 'firstName lastName username')
      .populate('customerId', 'name phoneNumber')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Sale.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        sales,
        pagination: {
          current: pageNumber,
          pages: Math.ceil(total / limitNumber),
          total,
          limit: limitNumber
        }
      }
    });

  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching sales'
    });
  }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private (cashier, manager, admin)
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashierId', 'firstName lastName username')
      .populate('customerId', 'name phoneNumber email')
      .populate('itemsSold.productId', 'name SKU category');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { sale }
    });

  } catch (error) {
    console.error('Get sale by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching sale'
    });
  }
};

// @desc    Process sale return
// @route   POST /api/sales/:id/return
// @access  Private (manager, admin)
const processSaleReturn = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemReturns, reason } = req.body;
    const saleId = req.params.id;

    const sale = await Sale.findById(saleId).session(session);
    
    if (!sale) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    if (sale.status === 'returned') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Sale has already been fully returned'
      });
    }

    // Process each return item
    let totalRefund = 0;
    const processedReturns = [];

    for (const returnItem of itemReturns) {
      const saleItem = sale.itemsSold.id(returnItem.saleItemId);
      
      if (!saleItem) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Sale item not found: ${returnItem.saleItemId}`
        });
      }

      // Check if return quantity is valid
      const alreadyReturned = sale.returnedItems
        .filter(ret => ret.saleItemId.equals(saleItem._id))
        .reduce((sum, ret) => sum + ret.quantityReturned, 0);

      const availableToReturn = saleItem.quantity - alreadyReturned;

      if (returnItem.quantityReturned > availableToReturn) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Cannot return ${returnItem.quantityReturned} units. Only ${availableToReturn} units available for return.`
        });
      }

      // Calculate refund amount
      const unitRefund = saleItem.priceAtSale - (saleItem.discountApplied / saleItem.quantity);
      const itemRefund = unitRefund * returnItem.quantityReturned;
      totalRefund += itemRefund;

      // Update product stock
      const product = await Product.findById(saleItem.productId).session(session);
      if (product) {
        product.currentStock += returnItem.quantityReturned;
        await product.save({ session });
      }

      processedReturns.push({
        saleItemId: saleItem._id,
        quantityReturned: returnItem.quantityReturned,
        returnReason: reason || 'customer_request',
        refundAmount: itemRefund
      });
    }

    // Update sale with return information
    await sale.processReturn(processedReturns);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Return processed successfully',
      data: {
        sale,
        totalRefund: totalRefund.toFixed(2),
        returnedItems: processedReturns
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Process return error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing return'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get daily sales summary
// @route   GET /api/sales/daily-summary
// @access  Private (cashier, manager, admin)
const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    
    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const summary = await Sale.aggregate([
      {
        $match: {
          date: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalCashReceived: { $sum: '$cashReceived' },
          totalChangeGiven: { $sum: '$changeGiven' },
          totalDiscount: { $sum: '$totalDiscount' },
          totalItemsSold: { $sum: { $size: '$itemsSold' } },
          averageSaleAmount: { $avg: '$totalAmount' }
        }
      }
    ]);

    const result = summary[0] || {
      totalSales: 0,
      totalRevenue: 0,
      totalCashReceived: 0,
      totalChangeGiven: 0,
      totalDiscount: 0,
      totalItemsSold: 0,
      averageSaleAmount: 0
    };

    res.status(200).json({
      success: true,
      data: {
        date: startOfDay.toISOString().split('T')[0],
        summary: result
      }
    });

  } catch (error) {
    console.error('Get daily summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching daily summary'
    });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  processSaleReturn,
  getDailySummary
};