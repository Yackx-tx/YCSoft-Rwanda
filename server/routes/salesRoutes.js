const express = require("express");
const router = express.Router();
const { recordSale, getSales } = require("../Controllers/salesController");
const { protect } = require("../middleware/authMiddleware");

// Record a sale
router.post("/", protect, recordSale);

// Get sales (for report)
router.get("/", protect, getSales);

module.exports = router;
