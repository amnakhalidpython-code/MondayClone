/**
 * Test MongoDB Connection
 * Simple script to verify MongoDB connectivity
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB connection...\n');
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found in .env' : 'NOT FOUND');
  
  try {
    console.log('⏳ Attempting to connect...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    console.log('\n✅ SUCCESS! MongoDB connected');
    console.log('📍 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔌 Ready State:', conn.connection.readyState);
    
    // Test a simple query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📁 Collections:', collections.map(c => c.name).join(', ') || 'None yet');
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check MongoDB Atlas Network Access');
    console.error('2. Verify IP is whitelisted (0.0.0.0/0 for testing)');
    console.error('3. Check internet connection');
    console.error('4. Verify MONGO_URI in .env file');
    process.exit(1);
  }
};

testConnection();
