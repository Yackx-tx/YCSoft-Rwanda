const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// Get Products (search + pagination)
exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(products);
};

// Update Product
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};