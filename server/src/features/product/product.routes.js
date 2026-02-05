const express = require('express');
const router = express.Router();
const productController = require('./product.controller.js');

// POST /api/v1/product
router.post('/', productController.createProduct);

// PUT /api/v1/product/meta-data
router.put('/meta-data', productController.updateMetadata);

module.exports = router;