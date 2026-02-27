const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      profit: Number,
    },
  ],
  totalAmount: Number,
  totalProfit: Number,
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
