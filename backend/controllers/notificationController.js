const db = require("../config/db");

// ======================================
// Get Vendor Notifications
// ======================================

exports.getNotifications = (req, res) => {

    const vendorId = req.query.vendor_id;

    const sql = `
        SELECT *
        FROM notifications
        WHERE vendor_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [vendorId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json(result);

    });

};

// ======================================
// Get Customer Notifications
// ======================================

exports.getCustomerNotifications = (req, res) => {

    const customerId = req.params.customerId;

    const sql = `
        SELECT *
        FROM notifications
        WHERE customer_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [customerId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json(result);

    });

};

// ======================================
// Create Notification
// ======================================

exports.createNotification = (req, res) => {

    const {
        vendor_id,
        customer_id,
        title,
        message,
        type
    } = req.body;

    const sql = `
        INSERT INTO notifications
        (
            vendor_id,
            customer_id,
            title,
            message,
            type
        )
        VALUES (?,?,?,?,?)
    `;

    db.query(

        sql,

        [
            vendor_id || null,
            customer_id || null,
            title,
            message,
            type
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            return res.json({
                success: true,
                message: "Notification Created Successfully",
                notificationId: result.insertId
            });

        }

    );

};

// ======================================
// Mark Notification As Read
// ======================================

exports.markAsRead = (req, res) => {

    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json({
            success: true,
            message: "Notification Marked As Read"
        });

    });

};

// ======================================
// Delete Notification
// ======================================

exports.deleteNotification = (req, res) => {

    const sql = `
        DELETE FROM notifications
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        return res.json({
            success: true,
            message: "Notification Deleted Successfully"
        });

    });

};