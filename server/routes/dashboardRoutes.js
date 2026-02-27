const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// Get dashboard stats
router.get("/", protect, adminOnly, getDashboard);

module.exports = router;