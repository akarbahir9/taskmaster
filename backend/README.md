# POS & ERP System Backend

A comprehensive Point of Sale (POS) and Enterprise Resource Planning (ERP) system backend built with Node.js, Express.js, and MongoDB for cash-only market operations.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **POS System**: Real-time sales processing with inventory updates
- **Inventory Management**: Product management with automatic stock tracking
- **Customer Management**: Customer profiles with loyalty points
- **Supplier Management**: Supplier information and purchase orders
- **Cash Reconciliation**: Daily cash management and reconciliation
- **Reporting**: Sales summaries and inventory reports
- **Real-time Updates**: Socket.IO for real-time inventory updates

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. MongoDB Setup

#### Option A: Install MongoDB Community Edition

**Ubuntu/Debian:**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB packages
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS (using Homebrew):**
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community@6.0

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

**Windows:**
Download and install MongoDB Community Edition from the official MongoDB website.

#### Option B: Using Docker

```bash
# Pull MongoDB Docker image
docker pull mongo:latest

# Run MongoDB container
docker run --name pos-erp-mongodb -p 27017:27017 -d mongo:latest
```

### 2. Backend Setup

```bash
# Clone or navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/pos-erp-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Seeding

```bash
# Seed the database with sample data
npm run seed
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Sales (POS)
- `POST /api/sales` - Create new sale
- `GET /api/sales` - Get all sales (with pagination)
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales/:id/return` - Process sale return
- `GET /api/sales/daily-summary` - Get daily sales summary

### Products
- `GET /api/products` - Get all products (with filters)
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Deactivate product
- `GET /api/products/search` - Search products (for POS)
- `GET /api/products/low-stock` - Get low stock products

### Additional Endpoints
More endpoints for suppliers, customers, purchase orders, inventory adjustments, and reports will be implemented in the next phase.

## 🔐 Default Login Credentials

After running the seed script, you can use these credentials to test the system:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Manager | manager1 | manager123 |
| Cashier | cashier1 | cashier123 |
| Cashier | cashier2 | cashier123 |

## 🗄️ Database Schema

### Collections

1. **Users** - Authentication and user management
2. **Products** - Product catalog and inventory
3. **Sales** - POS transactions and sales history
4. **Customers** - Customer information and loyalty
5. **Suppliers** - Supplier management
6. **PurchaseOrders** - Procurement tracking
7. **InventoryAdjustments** - Stock adjustments
8. **DailyCashReconciliation** - Cash management

## 🔒 Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting
- Input validation with Joi
- CORS configuration
- Helmet.js security headers

## 📊 Sample Data

The seed script creates:
- 4 users (1 admin, 1 manager, 2 cashiers)
- 4 suppliers
- 12 products across different categories
- 3 sample customers

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### API Testing
```bash
# Login example
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "cashier1", "password": "cashier123"}'

# Search products example
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:5000/api/products/search?q=coca"
```

## 🔧 Development

### Project Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t pos-erp-backend .

# Run container
docker run -p 5000:5000 --env-file .env pos-erp-backend
```

### Production Considerations
1. Use a production MongoDB instance
2. Set strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Implement logging and monitoring
6. Set up automated backups

## 📝 Next Steps

Phase 2 will include:
- Additional controllers for suppliers, customers, purchase orders
- Socket.IO implementation for real-time updates
- Comprehensive reporting endpoints
- File upload functionality
- Advanced inventory features
- Cash reconciliation features

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `sudo systemctl status mongod`
   - Check connection string in .env file
   - Verify MongoDB is listening on port 27017

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

3. **Authentication Errors**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration
   - Verify user credentials

## 📞 Support

For issues and questions, please check the documentation or create an issue in the project repository.

## 📜 License

This project is licensed under the ISC License.