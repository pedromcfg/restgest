const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'RESTGEST API is running', 
    timestamp: new Date().toISOString() 
  });
});

// Export for Vercel
module.exports = app;
