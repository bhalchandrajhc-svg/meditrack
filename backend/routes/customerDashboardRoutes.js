const express = require("express");
const router = express.Router();

const {
    getDashboardSummary
} = require("../controllers/customerDashboardController");

router.get("/:customerId", getDashboardSummary);

module.exports = router;