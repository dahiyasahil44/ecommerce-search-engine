const express = require('express');
const router = express.Router();
const searchController = require('./search.controller.js');

// GET /api/v1/search/product?query="Sasta Iphone"
router.get('/product', searchController.search);

module.exports = router;