const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Products (search + pagination)
exports.getProducts = async (req, res) => {
  try{
    const { page = 1, limit = 10, search = "" } = req.query;

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.json({
      products,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};