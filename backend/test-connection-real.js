const mongoose = require('mongoose');

// Substitui <db_password> pela password real do utilizador admin
const MONGODB_URI = 'mongodb+srv://admin:Th!€fG0ld1999@gestorrestauracao.cb8bhkk.mongodb.net/?retryWrites=true&w=majority&appName=GestorRestauracao';

console.log('🔄 Testing MongoDB connection with real password...');
console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

mongoose.connect(MONGODB_URI, {
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

