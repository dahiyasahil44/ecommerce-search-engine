const searchService = require('./search.service.js');

exports.search = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query required" });

    const results = await searchService.searchProducts(query);
    
    // Format response to match requirement
    const formatted = results.map(p => ({
      productId: p._id,
      title: p.title,
      description: p.description,
      mrp: p.mrp,
      Sellingprice: p.price,
      stock: p.stock,
      Metadata: p.metadata
    }));

    res.json({ data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};