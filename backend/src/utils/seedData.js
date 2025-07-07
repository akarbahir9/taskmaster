require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [
      {
        username: 'admin',
        passwordHash: 'admin123',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@posmarket.com',
        phoneNumber: '+1-555-0100'
      },
      {
        username: 'manager1',
        passwordHash: 'manager123',
        role: 'manager',
        firstName: 'John',
        lastName: 'Manager',
        email: 'manager@posmarket.com',
        phoneNumber: '+1-555-0101'
      },
      {
        username: 'cashier1',
        passwordHash: 'cashier123',
        role: 'cashier',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@posmarket.com',
        phoneNumber: '+1-555-0102'
      },
      {
        username: 'cashier2',
        passwordHash: 'cashier123',
        role: 'cashier',
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob@posmarket.com',
        phoneNumber: '+1-555-0103'
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create suppliers
    const suppliers = [
      {
        name: 'Fresh Foods Distribution',
        contactPerson: 'Mike Rodriguez',
        phoneNumber: '+1-555-1001',
        email: 'mike@freshfoods.com',
        address: {
          street: '123 Supply Chain Blvd',
          city: 'Distribution City',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        paymentTerms: 'Net 30'
      },
      {
        name: 'Dairy Direct',
        contactPerson: 'Sarah Chen',
        phoneNumber: '+1-555-1002',
        email: 'sarah@dairydirect.com',
        address: {
          street: '456 Milk Road',
          city: 'Cow Town',
          state: 'WI',
          zipCode: '53704',
          country: 'USA'
        },
        paymentTerms: 'Net 15'
      },
      {
        name: 'Household Essentials Co',
        contactPerson: 'David Park',
        phoneNumber: '+1-555-1003',
        email: 'david@householdessentials.com',
        address: {
          street: '789 Commerce Way',
          city: 'Industrial Park',
          state: 'TX',
          zipCode: '75201',
          country: 'USA'
        },
        paymentTerms: 'Net 45'
      },
      {
        name: 'Snack Attack Distributors',
        contactPerson: 'Lisa Thompson',
        phoneNumber: '+1-555-1004',
        email: 'lisa@snackattack.com',
        address: {
          street: '321 Snack Street',
          city: 'Munchville',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        paymentTerms: 'Cash on Delivery'
      }
    ];

    const createdSuppliers = await Supplier.create(suppliers);
    console.log(`🏭 Created ${createdSuppliers.length} suppliers`);

    // Create products
    const products = [
      // Beverages
      {
        name: 'Coca-Cola 12oz Can',
        SKU: 'BEV001',
        description: 'Classic Coca-Cola in 12oz aluminum can',
        category: 'Beverages',
        unitOfMeasure: 'piece',
        price: 1.50,
        costPrice: 0.85,
        currentStock: 144,
        reorderPoint: 24,
        reorderQuantity: 144,
        supplier: createdSuppliers[0]._id,
        expiryDateTracking: false
      },
      {
        name: 'Pepsi 2L Bottle',
        SKU: 'BEV002',
        description: 'Pepsi Cola in 2 liter plastic bottle',
        category: 'Beverages',
        unitOfMeasure: 'piece',
        price: 2.99,
        costPrice: 1.75,
        currentStock: 48,
        reorderPoint: 12,
        reorderQuantity: 48,
        supplier: createdSuppliers[0]._id,
        expiryDateTracking: false
      },
      {
        name: 'Orange Juice 1L',
        SKU: 'BEV003',
        description: 'Fresh squeezed orange juice',
        category: 'Beverages',
        unitOfMeasure: 'piece',
        price: 4.99,
        costPrice: 2.80,
        currentStock: 24,
        reorderPoint: 6,
        reorderQuantity: 30,
        supplier: createdSuppliers[0]._id,
        expiryDateTracking: true
      },
      // Dairy
      {
        name: 'Whole Milk 1 Gallon',
        SKU: 'DAI001',
        description: 'Fresh whole milk in gallon container',
        category: 'Dairy',
        unitOfMeasure: 'piece',
        price: 3.89,
        costPrice: 2.20,
        currentStock: 36,
        reorderPoint: 8,
        reorderQuantity: 48,
        supplier: createdSuppliers[1]._id,
        expiryDateTracking: true
      },
      {
        name: 'Cheddar Cheese 8oz',
        SKU: 'DAI002',
        description: 'Sharp cheddar cheese block',
        category: 'Dairy',
        unitOfMeasure: 'piece',
        price: 4.49,
        costPrice: 2.65,
        currentStock: 18,
        reorderPoint: 5,
        reorderQuantity: 24,
        supplier: createdSuppliers[1]._id,
        expiryDateTracking: true
      },
      {
        name: 'Greek Yogurt 32oz',
        SKU: 'DAI003',
        description: 'Plain Greek yogurt large container',
        category: 'Dairy',
        unitOfMeasure: 'piece',
        price: 5.99,
        costPrice: 3.40,
        currentStock: 12,
        reorderPoint: 4,
        reorderQuantity: 18,
        supplier: createdSuppliers[1]._id,
        expiryDateTracking: true
      },
      // Snacks
      {
        name: 'Potato Chips Family Size',
        SKU: 'SNK001',
        description: 'Classic salted potato chips family size bag',
        category: 'Snacks',
        unitOfMeasure: 'piece',
        price: 3.99,
        costPrice: 2.15,
        currentStock: 60,
        reorderPoint: 12,
        reorderQuantity: 72,
        supplier: createdSuppliers[3]._id,
        expiryDateTracking: false
      },
      {
        name: 'Chocolate Candy Bar',
        SKU: 'SNK002',
        description: 'Milk chocolate candy bar',
        category: 'Snacks',
        unitOfMeasure: 'piece',
        price: 1.25,
        costPrice: 0.65,
        currentStock: 120,
        reorderPoint: 24,
        reorderQuantity: 144,
        supplier: createdSuppliers[3]._id,
        expiryDateTracking: true
      },
      // Household
      {
        name: 'Paper Towels 6-Pack',
        SKU: 'HOU001',
        description: 'Absorbent paper towels 6-pack',
        category: 'Household',
        unitOfMeasure: 'pack',
        price: 8.99,
        costPrice: 5.25,
        currentStock: 24,
        reorderPoint: 6,
        reorderQuantity: 30,
        supplier: createdSuppliers[2]._id,
        expiryDateTracking: false
      },
      {
        name: 'Dish Soap 24oz',
        SKU: 'HOU002',
        description: 'Liquid dish soap concentrated formula',
        category: 'Household',
        unitOfMeasure: 'piece',
        price: 2.79,
        costPrice: 1.45,
        currentStock: 36,
        reorderPoint: 8,
        reorderQuantity: 48,
        supplier: createdSuppliers[2]._id,
        expiryDateTracking: false
      },
      // Fresh Produce
      {
        name: 'Bananas',
        SKU: 'PRO001',
        description: 'Fresh bananas sold per pound',
        category: 'Fresh Produce',
        unitOfMeasure: 'kg',
        price: 1.89,
        costPrice: 0.95,
        currentStock: 25.5,
        reorderPoint: 5,
        reorderQuantity: 30,
        supplier: createdSuppliers[0]._id,
        expiryDateTracking: true
      },
      {
        name: 'Red Apples',
        SKU: 'PRO002',
        description: 'Fresh red apples sold per pound',
        category: 'Fresh Produce',
        unitOfMeasure: 'kg',
        price: 2.49,
        costPrice: 1.35,
        currentStock: 18.2,
        reorderPoint: 4,
        reorderQuantity: 25,
        supplier: createdSuppliers[0]._id,
        expiryDateTracking: true
      }
    ];

    const createdProducts = await Product.create(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create customers
    const customers = [
      {
        name: 'Mary Johnson',
        phoneNumber: '+1-555-2001',
        email: 'mary.johnson@email.com',
        address: {
          street: '123 Main St',
          city: 'Hometown',
          state: 'CA',
          zipCode: '90210'
        },
        loyaltyPoints: 250,
        totalSpent: 1250.75
      },
      {
        name: 'Robert Smith',
        phoneNumber: '+1-555-2002',
        email: 'robert.smith@email.com',
        address: {
          street: '456 Oak Ave',
          city: 'Hometown',
          state: 'CA',
          zipCode: '90210'
        },
        loyaltyPoints: 180,
        totalSpent: 890.25
      },
      {
        name: 'Jennifer Wilson',
        phoneNumber: '+1-555-2003',
        email: 'jennifer.wilson@email.com',
        address: {
          street: '789 Pine Rd',
          city: 'Hometown',
          state: 'CA',
          zipCode: '90211'
        },
        loyaltyPoints: 420,
        totalSpent: 2100.50
      }
    ];

    const createdCustomers = await Customer.create(customers);
    console.log(`👥 Created ${createdCustomers.length} customers`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: username: admin, password: admin123');
    console.log('Manager: username: manager1, password: manager123');
    console.log('Cashier: username: cashier1, password: cashier123');
    console.log('Cashier: username: cashier2, password: cashier123');

    console.log('\n📊 Created:');
    console.log(`- ${createdUsers.length} users`);
    console.log(`- ${createdSuppliers.length} suppliers`);
    console.log(`- ${createdProducts.length} products`);
    console.log(`- ${createdCustomers.length} customers`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;