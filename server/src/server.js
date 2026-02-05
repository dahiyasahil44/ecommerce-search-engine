require('dotenv').config();
const app = require('./app'); // Import the configured Express app
const mongoose = require('mongoose');
const { refreshCache } = require('./features/search/search.service.js');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_search';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Initialize the in-memory search cache
    console.log('🔄 Loading product catalog into memory...');
    await refreshCache();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });