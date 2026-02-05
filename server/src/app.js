const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Import Routes
const productRoutes = require('./features/product/product.routes.js');
const searchRoutes = require('./features/search/search.routes.js');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// We mount them to match the required API structure
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/search', searchRoutes);

module.exports = app;