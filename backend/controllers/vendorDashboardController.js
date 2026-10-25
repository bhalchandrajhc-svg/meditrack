const db = require("../config/db");

exports.getDashboard = (req, res) => {

    const vendorId = req.params.vendorId;

    const dashboard = {};

    // ==========================
    // Total Medicines
    // ==========================

    const medicineSql = `
        SELECT COUNT(*) AS total
        FROM medicines
        WHERE vendor_id = ?
    `;

    db.query(medicineSql, [vendorId], (err, medicines) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        dashboard.totalMedicines = medicines[0].total;

        // ==========================
        // Total Orders
        // ==========================

        const orderSql = `
            SELECT COUNT(*) AS total
            FROM orders
            WHERE vendor_id = ?
        `;

        db.query(orderSql, [vendorId], (err, orders) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            dashboard.totalOrders = orders[0].total;

            // ==========================
            // Pending Orders
            // ==========================

            const pendingSql = `
                SELECT COUNT(*) AS total
                FROM orders
                WHERE vendor_id = ?
                AND status = 'Pending'
            `;

            db.query(pendingSql, [vendorId], (err, pending) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }

                dashboard.pendingOrders = pending[0].total;

                // ==========================
                // Low Stock Count
                // ==========================

                const lowStockSql = `
                    SELECT COUNT(*) AS total
                    FROM medicines
                    WHERE vendor_id = ?
                    AND stock <= 10
                `;

                db.query(lowStockSql, [vendorId], (err, lowStock) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }

                    dashboard.lowStock = lowStock[0].total;

                    // ==========================
                    // Recent Orders
                    // ==========================

                    const recentOrderSql = `
                        SELECT

                            orders.id,
                            users.username AS customer_name,
                            medicines.name AS medicine_name,
                            orders.status

                        FROM orders

                        INNER JOIN users
                            ON users.id = orders.customer_id

                        INNER JOIN medicines
                            ON medicines.id = orders.medicine_id

                        WHERE orders.vendor_id = ?

                        ORDER BY orders.id DESC

                        LIMIT 5
                    `;

                    db.query(recentOrderSql, [vendorId], (err, recentOrders) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        dashboard.recentOrders = recentOrders;

                        // ==========================
                        // Stock Alerts
                        // ==========================

                        const alertSql = `
                            SELECT

                                id,
                                name,
                                stock

                            FROM medicines

                            WHERE vendor_id = ?
                            AND stock <= 10

                            ORDER BY stock ASC
                        `;

                        db.query(alertSql, [vendorId], (err, alerts) => {

                            if (err) {
                                console.log(err);
                                return res.status(500).json(err);
                            }

                            dashboard.stockAlerts = alerts;

                            return res.json(dashboard);

                        });

                    });

                });

            });

        });

    });

};