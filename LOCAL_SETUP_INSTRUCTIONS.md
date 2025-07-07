# 🏠 Local Setup Instructions for MongoDB Compass Users

## Prerequisites
- MongoDB Compass installed ✅ (you have this)
- MongoDB Server running locally
- Node.js installed

## Step 1: Check MongoDB Server is Running

1. **Open MongoDB Compass**
2. **Make sure you're connected** - you should see databases in the left sidebar
3. **Note your connection string** - usually `mongodb://localhost:27017`

## Step 2: Download and Setup Project

```bash
# 1. Download this project to your local machine
# 2. Navigate to the project folder

# 3. Setup Backend
cd backend
npm install

# 4. Update the .env file with your connection
# Edit backend/.env and set:
MONGO_URI=mongodb://localhost:27017/pos-erp-system
# (or whatever connection string you use in Compass)

# 5. Test the connection
node test-connection.js

# 6. Seed the database (creates tables and sample data)
npm run seed

# 7. Start the backend server
npm run dev
```

## Step 3: Setup Frontend

```bash
# In a new terminal window:
cd frontend
npm install
npm start
```

## Step 4: Test Login

1. **Open** http://localhost:3000
2. **Login with:**
   - Username: `admin`
   - Password: `admin123`

## Step 5: Check Your Database

1. **Open MongoDB Compass**
2. **Refresh** or **Connect** to see the new database: `pos-erp-system`
3. **You should see collections:**
   - users
   - products  
   - suppliers
   - customers
   - And others...

## 🚨 Troubleshooting

**If connection fails:**
1. Make sure MongoDB server is running (not just Compass)
2. Check the connection string in Compass
3. Try `mongodb://127.0.0.1:27017/pos-erp-system` instead

**If you see "MongoDB not running":**
- **Windows:** Start MongoDB service from Services
- **Mac:** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongod`

## ✅ Success Indicators

1. **Backend:** Console shows "MongoDB Connected" and server running on port 5000
2. **Frontend:** Login page loads at http://localhost:3000  
3. **Database:** You can see `pos-erp-system` database in Compass with collections
4. **Login Works:** You can login with admin/admin123

## 🔗 What You'll Have

- **POS System:** Full working Point of Sale with inventory
- **User Management:** Admin, Manager, Cashier roles
- **Real Database:** All data stored in your MongoDB
- **API:** RESTful backend for all operations