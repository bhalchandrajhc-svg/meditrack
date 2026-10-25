const express = require("express");

const router = express.Router();

const dashboard = require("../controllers/dashboardController");

// Dashboard Summary
router.get(
    "/summary/:vendorId",
    dashboard.vendorDashboard
);

// Recent Orders
router.get(
    "/recent-orders/:vendorId",
    dashboard.recentOrders
);

// Low Stock Medicines
router.get(
    "/low-stock/:vendorId",
    dashboard.lowStockMedicines
);

module.exports = router;