const express = require("express");

const router = express.Router();
const {
    getInventoryDashboard,
    getInventory,
    getCategoryStock,   
    getStockOverview,
    getStockHistory,
    updateMedicineStock
} = require("../controllers/inventoryController");



// ================= Dashboard =================

router.get(
    "/dashboard/:vendorId",
    getInventoryDashboard
);


// ================= Inventory =================

router.get(
    "/:vendorId",
    getInventory
);


// ================= Category Chart =================

router.get(
    "/category/:vendorId",
    getCategoryStock
);


// ================= Stock Overview =================

router.get(
    "/overview/:vendorId",
    getStockOverview
);


// ================= Stock History =================

router.get(
    "/history/:vendorId",
    getStockHistory
);


// ================= Update Stock =================

router.put(
    "/update-stock",
    updateMedicineStock
);
router.put("/update-stock", updateMedicineStock);

module.exports = router;