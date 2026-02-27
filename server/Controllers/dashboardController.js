const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.getDashboard = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalSales = await Sale.countDocuments();
  const lowStockProducts = await Product.find({
    quantityInStock: { $lt: 5 },
  });

  const profitData = await Sale.aggregate([
    { $group: { _id: null, totalProfit: { $sum: "$totalProfit" } } },
  ]);

  res.json({
    totalProducts,
    totalSales,
    lowStockProducts,
    totalProfit: profitData[0]?.totalProfit || 0,
  });
};