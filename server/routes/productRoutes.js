const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// Get all products (Admin + Cashier)
router.get("/", protect, getProducts);

// Create product (Admin only)
router.post("/", protect, adminOnly, createProduct);

// Update product (Admin only)
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product (Admin only)
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;