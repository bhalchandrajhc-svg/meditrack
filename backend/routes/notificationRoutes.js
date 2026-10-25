const express = require("express");

const router = express.Router();

const notification = require("../controllers/notificationController");

// GET vendor notifications
router.get("/", notification.getNotifications);

// GET customer notifications
router.get("/customer/:customerId", notification.getCustomerNotifications);

// POST
router.post("/", notification.createNotification);

// PUT
router.put("/read/:id", notification.markAsRead);

// DELETE
router.delete("/:id", notification.deleteNotification);

module.exports = router;