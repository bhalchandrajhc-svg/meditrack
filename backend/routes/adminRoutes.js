const express = require("express");
const admin = require("../controllers/adminController");
const router = express.Router();

router.post("/login", admin.login);
router.get("/dashboard", admin.requireAdmin, admin.getDashboard);
router.get("/notifications", admin.requireAdmin, admin.getNotifications);
router.get("/vendors/:id", admin.requireAdmin, admin.getVendorDetails);
router.put("/vendors/:id/status", admin.requireAdmin, admin.updateVendorStatus);

module.exports = router;
