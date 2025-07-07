require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  console.log('Connection string:', process.env.MONGO_URI);
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    // List existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Existing collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔐 Connection closed.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check if the connection string is correct');
      console.log('3. If using MongoDB Atlas, check username/password');
      console.log('4. Check network/firewall settings');
    }
  }
  
  process.exit(0);
}

testConnection();