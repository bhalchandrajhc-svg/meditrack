const express = require("express");

const router = express.Router();

const {

    getReportDashboard,
    getMonthlyRevenue,
    getOrderStatus,
    getTopMedicines,
    getReportOrders,
    getAiInsights

} = require("../controllers/reportController");

router.get("/dashboard/:vendorId", getReportDashboard);

router.get("/revenue/:vendorId", getMonthlyRevenue);

router.get("/status/:vendorId", getOrderStatus);

router.get("/top-medicines/:vendorId", getTopMedicines);

router.get("/orders/:vendorId", getReportOrders);

router.get("/ai-insights/:vendorId", getAiInsights);

module.exports = router;