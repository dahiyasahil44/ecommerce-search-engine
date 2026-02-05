const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true, index: true },
  mrp: Number,
  currency: { type: String, default: "Rupee" },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, // 0 to 5
  salesCount: { type: Number, default: 0 }, // For popularity ranking
  returnRate: { type: Number, default: 0 }, // Percentage (lower is better)
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} } // Flexible attributes
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);