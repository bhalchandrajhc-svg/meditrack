const db = require("../config/db");

// ======================================
// Vendor Dashboard Summary
// ======================================

exports.vendorDashboard = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT

            (SELECT COUNT(*)
             FROM medicines
             WHERE vendor_id = ?) AS totalMedicines,

            (SELECT COUNT(*)
             FROM orders
             WHERE vendor_id = ?) AS totalOrders,

            (SELECT COUNT(*)
             FROM orders
             WHERE vendor_id = ?
             AND status = 'Pending') AS pendingOrders,

            (SELECT COUNT(*)
             FROM medicines
             WHERE vendor_id = ?
             AND stock <= 10) AS lowStock
    `;

    db.query(

        sql,

        [
            vendorId,
            vendorId,
            vendorId,
            vendorId
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            return res.json(result[0]);

        }

    );

};


// ======================================
// Recent Orders
// ======================================

exports.recentOrders = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT

            o.id,

            u.username AS customer_name,

            m.name AS medicine_name,

            o.quantity,

            o.total_amount,

            o.status,

            o.order_date

        FROM orders o

        INNER JOIN users u
            ON u.id = o.customer_id

        INNER JOIN medicines m
            ON m.id = o.medicine_id

        WHERE o.vendor_id = ?

        ORDER BY o.id DESC

        LIMIT 5
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
// Low Stock Medicines
// ======================================

exports.lowStockMedicines = (req, res) => {

    const vendorId = req.params.vendorId;

    const sql = `
        SELECT

            id,

            name,

            stock,

            category

        FROM medicines

        WHERE vendor_id = ?

        AND stock <= 10

        ORDER BY stock ASC
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