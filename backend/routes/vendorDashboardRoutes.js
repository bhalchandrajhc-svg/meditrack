const express = require("express");
const router = express.Router();

const controller = require("../controllers/vendorDashboardController");

router.get("/:vendorId", controller.getDashboard);

module.exports = router;