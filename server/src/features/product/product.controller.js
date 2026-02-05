const Product = require('./product.model.js');
const { refreshCache } = require('../search/search.service.js');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    // Async refresh cache so we don't block response
    refreshCache(); 
    res.status(201).json({ productId: product._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMetadata = async (req, res) => {
  try {
    const { productId, Metadata } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { metadata: Metadata } },
      { new: true }
    );
    refreshCache();
    res.json({ productId: product._id, Metadata: product.metadata });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};