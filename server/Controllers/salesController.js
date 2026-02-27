const Product = require("../models/Product");
const Sale = require("../models/Sale");

exports.recordSale = async (req, res) => {
  const { items } = req.body;

  let totalAmount = 0;
  let totalProfit = 0;
  const productsToSave = [];

  for (let item of items) {
    const product = await Product.findById(item.productId);

    if (!product || product.quantityInStock < item.quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    const profit = (product.sellingPrice - product.buyingPrice) * item.quantity;

    totalAmount += product.sellingPrice * item.quantity;
    totalProfit += profit;

    product.quantityInStock -= item.quantity;
    await product.save();

    productsToSave.push({
      product: product._id,
      quantity: item.quantity,
      profit: profit,
    });
  }

  const sale = await Sale.create({
    products: productsToSave,
    totalAmount,
    totalProfit,
    cashier: req.user.id,
  });

  res.status(201).json(sale);
};

exports.getSales = async (req, res) => {
  try {
    let query = {};
    // If the user is a Cashier, restrict to their own sales
    if (req.user.role === "Cashier") {
      query.cashier = req.user.id;
    }

    const sales = await Sale.find(query)
      .populate("cashier", "name email")
      .populate("products.product", "name category sellingPrice")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching sales", error: error.message });
  }
};
