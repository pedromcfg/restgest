const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

console.log('🔄 Testing MongoDB connection...');
console.log('📍 URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  console.log('📊 Database:', mongoose.connection.name);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.error('🔧 Check your connection string and credentials');
  process.exit(1);
});
