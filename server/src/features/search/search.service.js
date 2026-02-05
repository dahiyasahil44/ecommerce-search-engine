const Fuse = require('fuse.js');
const Product = require('../product/product.model.js');

// IN-MEMORY CACHE (Simulating the requirement to store in-memory for speed)
let productCache = [];

// Refresh cache helper (Call this on app start and after updates)
const refreshCache = async () => {
  productCache = await Product.find({}).lean();
  console.log(`Cache refreshed: ${productCache.length} products loaded.`);
};

// 1. Detect Intent (Hinglish, Price Filters)
const parseIntent = (query) => {
  const intent = {
    isCheap: false, // "Sasta"
    maxPrice: null, // "50k"
    queryClean: query
  };

  const lowerQ = query.toLowerCase();

  // Detect "Sasta" or "Cheap"
  if (lowerQ.includes('sasta') || lowerQ.includes('cheap')) {
    intent.isCheap = true;
    intent.queryClean = intent.queryClean.replace(/sasta|cheap/gi, '').trim();
  }

  // Detect Price "50k" or "50000"
  const priceMatch = lowerQ.match(/(\d+)k/) || lowerQ.match(/(\d{4,})/);
  if (priceMatch) {
    let price = parseInt(priceMatch[1]);
    if (lowerQ.includes('k')) price *= 1000;
    intent.maxPrice = price;
    intent.queryClean = intent.queryClean.replace(priceMatch[0], '').trim();
  }

  return intent;
};

const searchProducts = async (rawQuery) => {
  if (productCache.length === 0) await refreshCache();

  const { isCheap, maxPrice, queryClean } = parseIntent(rawQuery);

  // 2. Fuzzy Search using Fuse.js (Handles "Ifone", "Samung")
  const fuse = new Fuse(productCache, {
    keys: ['title', 'description', 'metadata.color', 'metadata.category'],
    includeScore: true,
    threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
    ignoreLocation: true
  });

  let results = fuse.search(queryClean);

  // 3. Custom Ranking & Filtering Algorithm
  let rankedResults = results.map(result => {
    let item = result.item;
    let score = 0;

    // A. Text Relevance (Fuse gives lower value for better match, we invert it)
    score += (1 - result.score) * 100; 

    // B. Business Metrics Boosting
    score += (item.rating || 0) * 5;           // High rating boost
    score += Math.log10(item.salesCount || 1) * 2; // Sales popularity boost
    
    // C. Stock Penalty (If out of stock, push to bottom)
    if (item.stock === 0) score -= 500;

    // D. Intent Handling
    if (maxPrice && item.price > maxPrice) {
      score -= 1000; // Hard penalty if over budget
    }

    if (isCheap) {
      // Inverse price score: Cheaper items get higher score
      score += (100000 / (item.price + 1)); 
    }

    return { ...item, _rankingScore: score };
  });

  // Sort by final calculated score
  rankedResults.sort((a, b) => b._rankingScore - a._rankingScore);

  return rankedResults;
};

module.exports = { searchProducts, refreshCache };