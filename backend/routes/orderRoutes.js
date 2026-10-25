const express = require("express");
const router = express.Router();

const order = require("../controllers/orderController");

// =========================
// GET
// =========================

router.get("/", order.getOrders);

router.get("/customer/:customerId", order.getCustomerOrders);

router.get("/vendor/:vendorId", order.getVendorOrders);

router.get("/:id", order.getOrder);

// =========================
// POST
// =========================

router.post("/", order.addOrder);

router.post("/reserve", order.reserveMedicine);

// =========================
// UPDATE
// =========================

router.put("/:id/status", order.updateStatus);

// =========================
// DELETE
// =========================

router.delete("/:id", order.deleteOrder);

module.exports = router;